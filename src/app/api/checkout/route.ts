// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const body = (await request.json()) as any;

    // Extract form fields
    const {
      contact,
      news,
      country,
      firstName,
      lastName,
      company,
      address,
      apt,
      city,
      state,
      zip,
      paymentMethod,
      cartItems,
      subtotal,
      shipping,
      discount,
      discountAmount,
      total,
    } = body;

    // Validate required fields
    const errors: Record<string, string> = {};

    if (!contact) errors.contact = 'Contact is required';
    if (!country) errors.country = 'Country is required';
    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';
    if (!address) errors.address = 'Address is required';
    if (!city) errors.city = 'City is required';
    if (!state) errors.state = 'State is required';
    if (!zip) errors.zip = 'ZIP code is required';
    if (!paymentMethod) errors.paymentMethod = 'Payment method is required';

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      errors.cartItems = 'Cart is empty';
    }

    if (!total || Number(total) <= 0) {
      errors.total = 'Total amount is invalid';
    }

    // email / phone validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-\s()]{6,}$/;

    if (contact && !emailRegex.test(contact) && !phoneRegex.test(contact)) {
      errors.contact = 'Invalid email or phone number';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Create checkout form record
    const checkoutForm = await prisma.checkoutForm.create({
      data: {
        contact,
        news: news || false,
        country,
        firstName,
        lastName,
        company: company || null,
        address,
        apt: apt || null,
        city,
        state,
        zip,
        paymentMethod,
        cardNumber: null,
        cardDate: null,
        cardCvc: null,
        cardName: null,
        cartItems: cartItems as any,
        subtotal: subtotal || 0,
        shipping: shipping || 0,
        discount: discount || null,
        discountAmount: discountAmount || 0,
        total,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      message: 'Checkout form submitted successfully',
      orderId: checkoutForm.id,
    });
  } catch (error) {
    console.error('Error creating checkout form:', error);
    return NextResponse.json(
      { error: 'Failed to submit checkout form' },
      { status: 500 },
    );
  }
}
