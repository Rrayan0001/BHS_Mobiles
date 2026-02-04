'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from './page.module.css'

function OrderSuccessContent() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams.get('order') || 'ORD-UNKNOWN'
    const [confetti, setConfetti] = useState(true)

    useEffect(() => {
        // Hide confetti after animation
        const timer = setTimeout(() => setConfetti(false), 3000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className={styles.page}>
            {confetti && <div className={styles.confetti}>🎉</div>}

            <div className="container">
                <div className={styles.content}>
                    <div className={styles.successIcon}>✓</div>

                    <h1 className={styles.title}>Order Placed Successfully!</h1>

                    <p className={styles.subtitle}>
                        Thank you for your purchase. Your order has been confirmed.
                    </p>

                    <Card padding="lg" className={styles.orderCard}>
                        <div className={styles.orderInfo}>
                            <div className={styles.orderInfoItem}>
                                <span className={styles.label}>Order Number</span>
                                <span className={styles.value}>{orderNumber}</span>
                            </div>
                            <div className={styles.orderInfoItem}>
                                <span className={styles.label}>Estimated Delivery</span>
                                <span className={styles.value}>3-5 Business Days</span>
                            </div>
                        </div>
                    </Card>

                    <div className={styles.nextSteps}>
                        <h2>What's Next?</h2>
                        <div className={styles.stepsList}>
                            <div className={styles.step}>
                                <div className={styles.stepIcon}>📧</div>
                                <div>
                                    <strong>Order Confirmation Email</strong>
                                    <p>We've sent a confirmation email with your order details</p>
                                </div>
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepIcon}>📦</div>
                                <div>
                                    <strong>Order Processing</strong>
                                    <p>Your order will be processed and prepared for shipping</p>
                                </div>
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepIcon}>🚚</div>
                                <div>
                                    <strong>Shipping Updates</strong>
                                    <p>You'll receive tracking information once your order ships</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Link href="/account/orders">
                            <Button variant="primary" size="lg">
                                View Order Details
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" size="lg">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>

                    <div className={styles.support}>
                        <p>
                            Need help? <Link href="/contact">Contact our support team</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LoadingFallback() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.successIcon}>⏳</div>
                    <h1 className={styles.title}>Loading...</h1>
                </div>
            </div>
        </div>
    )
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <OrderSuccessContent />
        </Suspense>
    )
}
