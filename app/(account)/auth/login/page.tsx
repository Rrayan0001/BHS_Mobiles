'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from './page.module.css'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { signIn } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await signIn(email, password)

        if (error) {
            setError(error)
            setLoading(false)
        } else {
            // Check for redirect parameter
            const redirect = searchParams.get('redirect')
            router.push(redirect || '/account')
        }
    }

    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.authWrapper}>
                    <Card padding="lg" className={styles.authCard}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Welcome Back</h1>
                            <p className={styles.subtitle}>Sign in to your account</p>
                        </div>

                        {error && (
                            <div className={styles.errorAlert}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className={styles.form}>
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                            />

                            <div className={styles.passwordWrapper}>
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <Link href="/auth/forgot-password" className={styles.forgotPassword}>
                                    Forgot?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={loading}
                            >
                                Sign In
                            </Button>
                        </form>

                        <div className={styles.divider}>
                            <span>OR</span>
                        </div>

                        <div className={styles.footer}>
                            <p>
                                Don't have an account?{' '}
                                <Link href="/auth/register" className={styles.link}>
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
