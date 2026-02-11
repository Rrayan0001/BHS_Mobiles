import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()
        const { email, otp } = body

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
        }

        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'signup'
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            user: data.user,
            session: data.session,
            message: 'Email verified successfully'
        }, { status: 200 })
    } catch (error) {
        console.error('OTP verification error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
