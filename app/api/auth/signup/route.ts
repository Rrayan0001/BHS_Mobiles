import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()
        const { email, password, name, phone } = body

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
        }

        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    phone
                }
            }
        })

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        if (authData.user) {
            // Create user profile in users table
            const { error: profileError } = await supabase
                .from('users')
                .insert({
                    id: authData.user.id,
                    email: authData.user.email,
                    name,
                    phone
                })

            if (profileError) {
                console.error('Profile creation error:', profileError)
            }
        }

        return NextResponse.json({
            success: true,
            user: authData.user,
            message: 'Account created successfully'
        }, { status: 201 })
    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
