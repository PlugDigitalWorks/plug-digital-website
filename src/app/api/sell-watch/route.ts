// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';
import { uploadMultipleImagesToCloudinary } from '@/lib/cloudinary-edge';
import { sendSellWatchEmail } from '@/lib/emailService-edge';

export async function POST(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const formData = await request.formData();

    // Extract form fields
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const country = formData.get('country') as string;
    const city = formData.get('city') as string;
    const preferredContact = formData.get('preferredContact') as string;

    const brand = formData.get('brand') as string;
    const model = formData.get('model') as string;
    const year = formData.get('year') as string;
    const gender = formData.get('gender') as string;
    const dialColor = formData.get('dialColor') as string;
    const caseSize = formData.get('caseSize') as string;
    const caseSize2 = formData.get('caseSize2') as string;
    const movement = formData.get('movement') as string;
    const caseMaterial = formData.get('caseMaterial') as string;
    const braceletMaterial = formData.get('braceletMaterial') as string;
    const braceletColor = formData.get('braceletColor') as string;
    const box = formData.get('box') as string;
    const papers = formData.get('papers') as string;

    const condition = formData.get('condition') as string;
    const newOrPreOwned = formData.get('newOrPreOwned') as string;
    const waterResistance = formData.get('waterResistance') as string;
    const complications = formData.get('complications') as string;
    const crystal = formData.get('crystal') as string;
    const bezel = formData.get('bezel') as string;
    const crown = formData.get('crown') as string;
    const dialType = formData.get('dialType') as string;
    const lume = formData.get('lume') as string;

    const expectedPrice = formData.get('expectedPrice') as string;
    const priceCurrency = formData.get('priceCurrency') as string;
    const description = formData.get('description') as string;
    const urgency = formData.get('urgency') as string;
    const additionalNotes = formData.get('additionalNotes') as string;

    const photos = formData.getAll('photos[]') as File[];
    const submittedAt = formData.get('submittedAt') as string;

    const captchaToken = formData.get('captchaToken') as string;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !brand ||
      !model ||
      !expectedPrice ||
      !description
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Upload photos to Cloudinary
    let photoUrls: string[] = [];
    if (photos && photos.length > 0) {
      try {
        photoUrls = await uploadMultipleImagesToCloudinary(photos);
      } catch (error) {
        console.error('Error uploading photos:', error);
        return NextResponse.json(
          { error: 'Failed to upload photos' },
          { status: 500 },
        );
      }
    }
    // ✅ CAPTCHA VERIFY
    try {
      const secret = process.env.RECAPTCHA_SECRET_KEY;

      const captchaRes = await fetch(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${secret}&response=${captchaToken}`,
        },
      );

      const captchaData = (await captchaRes.json()) as any;

      if (!captchaData.success || captchaData.score < 0.5) {
        return NextResponse.json(
          { error: 'Captcha verification failed' },
          { status: 400 },
        );
      }
    } catch (err) {
      console.error('Captcha verify error:', err);
      return NextResponse.json(
        { error: 'Captcha verification error' },
        { status: 400 },
      );
    }

    // Create record
    const sellWatchForm = await prisma.sellYourWatchForm.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        country,
        city,
        preferredContact,

        brand,
        model,
        year: year ? parseInt(year) : undefined,
        gender,
        dialColor,
        caseSize: caseSize ? parseFloat(caseSize) : undefined,
        caseSize2: caseSize2 ? parseFloat(caseSize2) : undefined,
        movement,
        caseMaterial,
        braceletMaterial,
        braceletColor,
        box,
        papers,

        condition,
        newOrPreOwned,
        waterResistance,
        complications,
        crystal,
        bezel,
        crown,
        dialType,
        lume,

        expectedPrice: expectedPrice ? parseFloat(expectedPrice) : undefined,
        priceCurrency,
        description,
        urgency,
        additionalNotes,

        photos: photoUrls as any,
        status: 'PENDING',
        submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
      },
    });

    try {
      const emailSent = await sendSellWatchEmail(sellWatchForm);

      if (!emailSent) {
        console.error(
          '⚠️ Sell watch email could not be sent:',
          sellWatchForm.email,
        );
      }
    } catch (err) {
      console.error('⚠️ Sell watch email error:', err);
    }
    return NextResponse.json({
      message: 'Watch submission received successfully',
      formId: sellWatchForm.id,
    });
  } catch (error) {
    console.error('Error creating sell watch form:', error);
    return NextResponse.json(
      { error: 'Failed to submit watch form' },
      { status: 500 },
    );
  }
}
