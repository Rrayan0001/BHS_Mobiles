'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from '../login/page.module.css'

export default function RegisterPage() {
    const router = useRouter()
    const { signUp, verifyOtp } = useAuth()
    const [step, setStep] = useState<'form' | 'otp'>('form')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [otp, setOtp] = useState('')
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
            setLoading(false)
            setStep('otp')
        }
    }

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 8)
        setOtp(value)
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const otpString = otp
        if (otpString.length !== 8) {
            setError('Please enter the complete 8-digit OTP')
            setLoading(false)
            return
        }

        const { error } = await verifyOtp(formData.email, otpString)

        if (error) {
            setError(error)
            setLoading(false)
        } else {
            router.push('/auth/login?registered=true')
        }
    }

    // OTP Step
    if (step === 'otp') {
        return (
            <div className={styles.page}>
                <div className="container">
                    <div className={styles.authWrapper}>
                        <Card padding="lg" className={styles.authCard}>
                            <div className={styles.header}>
                                <div className={styles.otpIcon}>✉️</div>
                                <h1 className={styles.title}>Verify Email</h1>
                                <p className={styles.subtitle}>
                                    We&apos;ve sent an 8-digit code to
                                </p>
                                <p className={styles.otpEmail}>{formData.email}</p>
                            </div>

                            {error && (
                                <div className={styles.errorAlert}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleVerifyOtp} className={styles.form}>
                                <div className={styles.otpContainer}>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={8}
                                        value={otp}
                                        onChange={handleOtpChange}
                                        className={styles.otpInput}
                                        placeholder="Enter 8-digit code"
                                        autoFocus
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    loading={loading}
                                >
                                    Verify & Create Account
                                </Button>
                            </form>

                            <div className={styles.footer} style={{ marginTop: '1.5rem' }}>
                                <p className={styles.otpHint}>
                                    Didn&apos;t receive the code? Check your spam folder.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    // Registration Form Step
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
