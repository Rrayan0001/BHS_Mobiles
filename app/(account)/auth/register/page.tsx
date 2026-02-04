'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from '../login/page.module.css' // Reuse login styles

export default function RegisterPage() {
    const router = useRouter()
    const { signUp } = useAuth()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        const { error } = await signUp(
            formData.email,
            formData.password,
            formData.name,
            formData.phone
        )



        if (error) {
            setError(error)
            setLoading(false)
        } else {
            // Redirect to login with success message
            router.push('/auth/login?registered=true')
        }
    }

    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.authWrapper}>
                    <Card padding="lg" className={styles.authCard}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Create Account</h1>
                            <p className={styles.subtitle}>Join BHS Mobiles today</p>
                        </div>

                        {error && (
                            <div className={styles.errorAlert}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className={styles.form}>
                            <Input
                                label="Full Name"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                fullWidth
                            />

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                fullWidth
                            />

                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={handleChange}
                                fullWidth
                            />

                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                fullWidth
                                helperText="At least 6 characters"
                            />

                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                fullWidth
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={loading}
                            >
                                Create Account
                            </Button>
                        </form>

                        <div className={styles.divider}>
                            <span>OR</span>
                        </div>

                        <div className={styles.footer}>
                            <p>
                                Already have an account?{' '}
                                <Link href="/auth/login" className={styles.link}>
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
