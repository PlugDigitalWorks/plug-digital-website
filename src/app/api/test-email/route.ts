// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { testEmailConnection, sendOTPEmail } from '@/lib/emailService-edge';

export async function GET(request: NextRequest) {
  try {
    // Test Resend email connection
    const isConnected = await testEmailConnection();

    if (!isConnected) {
      return NextResponse.json(
        {
          success: false,
          error: 'Resend API connection failed',
          details: 'RESEND_API_KEY not configured or invalid',
          resendConfig: {
            apiKey: process.env.RESEND_API_KEY ? 'Set' : 'Not set',
            fromEmail: process.env.FROM_EMAIL || 'softawe@gmail.com',
          },
        },
        { status: 500 },
      );
    }

    // Test sending OTP email
    const testEmail = 'softawe@gmail.com'; // Test email'i kendimize gönderelim
    const testOTP = '123456';

    const emailSent = await sendOTPEmail(testEmail, testOTP);

    return NextResponse.json({
      success: true,
      message: 'Resend email service is working',
      resendConfig: {
        apiKey: process.env.RESEND_API_KEY ? 'Set' : 'Not set',
        fromEmail: process.env.FROM_EMAIL || 'softawe@gmail.com',
        service: 'Resend API',
      },
      testEmailSent: emailSent,
    });
  } catch (error: any) {
    console.error('Resend email test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Resend email test failed',
        details: error.message,
        resendConfig: {
          apiKey: process.env.RESEND_API_KEY ? 'Set' : 'Not set',
          fromEmail: process.env.FROM_EMAIL || 'softawe@gmail.com',
        },
      },
      { status: 500 },
    );
  }
}
