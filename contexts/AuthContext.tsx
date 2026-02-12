'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

// Mock user type for frontend-only mode
interface MockUser {
    id: string
    email: string
    user_metadata?: {
        name?: string
        phone?: string
    }
}

interface AuthContextType {
    user: User | MockUser | null
    session: Session | unknown | null
    loading: boolean
    signUp: (email: string, password: string, name?: string, phone?: string) => Promise<{ error: string | null }>
    verifyOtp: (email: string, otp: string) => Promise<{ error: string | null }>
    signIn: (email: string, password: string) => Promise<{ error: string | null }>
    signOut: () => Promise<void>
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Check if Supabase is configured
const isSupabaseConfigured = () => {
    return !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_project_url'
    )
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | MockUser | null>(null)
    const [session, setSession] = useState<Session | unknown | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    // Initialize session and listen for changes
    useEffect(() => {
        const initializeAuth = async () => {
            if (isSupabaseConfigured()) {
                try {
                    // Get initial session
                    const { data: { session: initialSession } } = await supabase.auth.getSession()
                    setSession(initialSession)
                    setUser(initialSession?.user ?? null)

                    // Listen for auth changes
                    const { data: { subscription } } = supabase.auth.onAuthStateChange(
                        async (_event, newSession) => {
                            setSession(newSession)
                            setUser(newSession?.user ?? null)
                            setLoading(false)
                        }
                    )

                    return () => subscription.unsubscribe()
                } catch (error) {
                    console.error('Error initializing auth:', error)
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }

        initializeAuth()
    }, [])

    // For frontend showcase - mock auth functions
    const signUp = async (email: string, password: string, name?: string, phone?: string) => {
        // If Supabase is configured, try real signup
        if (isSupabaseConfigured()) {
            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, name, phone })
                })
                const data = await response.json()

                if (!response.ok) {
                    return { error: data.error || 'Signup failed' }
                }

                if (data.user) {
                    setUser(data.user)
                }

                return { error: null }
            } catch {
                return { error: 'Network error. Please try again.' }
            }
        }

        // Mock signup for frontend showcase
        const mockUser: MockUser = {
            id: 'mock-user-' + Date.now(),
            email: email,
            user_metadata: { name, phone }
        }
        setUser(mockUser)
        return { error: null }
    }

    const verifyOtp = async (email: string, otp: string) => {
        if (isSupabaseConfigured()) {
            try {
                const response = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp })
                })
                const data = await response.json()

                if (!response.ok) {
                    return { error: data.error || 'OTP verification failed' }
                }

                if (data.user) {
                    setUser(data.user)
                    setSession(data.session)
                }

                return { error: null }
            } catch {
                return { error: 'Network error. Please try again.' }
            }
        }

        // Mock OTP verification for frontend showcase
        return { error: null }
    }

    const signIn = async (email: string, password: string) => {
        // If Supabase is configured, try real signin
        if (isSupabaseConfigured()) {
            try {
                const response = await fetch('/api/auth/signin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                })
                const data = await response.json()

                if (!response.ok) {
                    return { error: data.error || 'Login failed' }
                }

                if (data.user) {
                    setUser(data.user)
                    setSession(data.session)
                }

                return { error: null }
            } catch {
                return { error: 'Network error. Please try again.' }
            }
        }

        // Mock signin for frontend showcase
        const mockUser: MockUser = {
            id: 'mock-user-' + Date.now(),
            email: email,
            user_metadata: { name: email.split('@')[0] }
        }
        setUser(mockUser)
        return { error: null }
    }

    const signOut = async () => {
        if (isSupabaseConfigured()) {
            try {
                await fetch('/api/auth/signout', { method: 'POST' })
            } catch (error) {
                console.error('Sign out error:', error)
            }
        }
        setUser(null)
        setSession(null)
    }

    return (
        <AuthContext.Provider value={{
            user,
            session,
            loading,
            signUp,
            verifyOtp,
            signIn,
            signOut,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
