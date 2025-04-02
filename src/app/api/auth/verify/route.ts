import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    // Find user by email and verification token
    const user = await prisma.user.findFirst({
      where: {
        email,
        verificationToken: otp,
        verificationTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      }
    });

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}