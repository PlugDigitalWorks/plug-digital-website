export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const body = (await request.json()) as { email?: string };
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 },
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      );
    }

    const emailLower = email.trim().toLowerCase();

    // Check if email already exists
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email: emailLower },
    });

    if (existing) {
      // If exists but unsubscribed, resubscribe
      if (!existing.subscribed) {
        await prisma.newsletterSubscription.update({
          where: { email: emailLower },
          data: { subscribed: true, updatedAt: new Date() },
        });
        return NextResponse.json({
          message: 'Successfully resubscribed to newsletter',
          subscribed: true,
        });
      }
      // Already subscribed
      return NextResponse.json({
        message: 'Email is already subscribed',
        subscribed: true,
      });
    }

    // Create new subscription
    await prisma.newsletterSubscription.create({
      data: {
        email: emailLower,
        subscribed: true,
      },
    });

    return NextResponse.json({
      message: 'Successfully subscribed to newsletter',
      subscribed: true,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 },
    );
  }
}
