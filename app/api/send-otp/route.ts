import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service-enhanced'
import { db } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email, purpose = 'login' } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP in database
    await db.otps.add({
      email,
      otp,
      purpose,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0
    })

    // Send email using enhanced service
    const result = await emailService.sendOTP(email, otp, purpose)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('API send-otp error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}