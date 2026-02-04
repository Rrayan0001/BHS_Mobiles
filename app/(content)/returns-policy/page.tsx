'use client'

import React from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import styles from './page.module.css'

export default function ReturnsPolicyPage() {
    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Returns & Refunds</h1>
                    <p className={styles.subtitle}>
                        Simple, hassle-free returns. Your satisfaction is our priority.
                    </p>
                </div>
            </header>

            <div className="container">
                <div className={styles.content}>
                    <div className={styles.processSteps}>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>1</div>
                            <h3>Request Return</h3>
                            <p>Initiate a return request from your account within 7 days of delivery.</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>2</div>
                            <h3>Pickup & Check</h3>
                            <p>We'll pick up the item. Our team will verify the condition.</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>3</div>
                            <h3>Refund Process</h3>
                            <p>Once approved, refund is initiated to your original payment method.</p>
                        </div>
                    </div>

                    <section className={styles.section}>
                        <h2>Return Eligibility</h2>
                        <div className={styles.eligibilityGrid}>
                            <div className={styles.card}>
                                <div className={styles.icon}>✅</div>
                                <h3>Eligible for Return</h3>
                                <ul>
                                    <li>Defective or malfunctioning device</li>
                                    <li>Wrong item delivered</li>
                                    <li>Product not as described</li>
                                    <li>In original condition with box & accessories</li>
                                </ul>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.icon}>❌</div>
                                <h3>Not Eligible</h3>
                                <ul>
                                    <li>Physical damage caused by user</li>
                                    <li>Liquid damage</li>
                                    <li>Missing accessories or box</li>
                                    <li>Return requested after 7 days</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2>Frequently Asked Questions</h2>
                        <div className={styles.faqList}>
                            <div className={styles.faqItem}>
                                <h3>How long does the refund take?</h3>
                                <p>Refunds are processed within 24-48 hours after the device passes our quality check. It may take 3-5 business days to reflect in your bank account.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Do I have to pay for return shipping?</h3>
                                <p>No, we cover the return shipping costs for all eligible returns.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Can I exchange instead of refund?</h3>
                                <p>Yes, you can choose to exchange for another device of the same value or get store credit.</p>
                            </div>
                        </div>
                    </section>

                    <div className={styles.cta}>
                        <h2>Ready to start a return?</h2>
                        <p>Go to your orders page to initiate a return request.</p>
                        <Link href="/account/orders">
                            <Button variant="primary" size="lg">Go to My Orders</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
