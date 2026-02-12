import React from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import styles from './page.module.css'

export default function WarrantyPage() {
    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Nawaz Mobiles Warranty Policy</h1>
                    <p className={styles.subtitle}>
                        Peace of mind with every purchase. We stand behind our quality.
                    </p>
                </div>
            </header>

            <div className="container">
                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>Coverage by Condition</h2>
                        <div className={styles.grid}>
                            <Card padding="lg" className={styles.card}>
                                <div className={styles.badge}>Grade A</div>
                                <h3>Like New</h3>
                                <ul className={styles.list}>
                                    <li>6 Months Comprehensive Warranty</li>
                                    <li>Battery Performance Guarantee</li>
                                    <li>7-Day Replacement Policy</li>
                                    <li>Software Support</li>
                                </ul>
                            </Card>

                            <Card padding="lg" className={styles.card}>
                                <div className={`${styles.badge} ${styles.badgeB}`}>Grade B</div>
                                <h3>Good Condition</h3>
                                <ul className={styles.list}>
                                    <li>3 Months Warranty</li>
                                    <li>Functional Hardware Coverage</li>
                                    <li>7-Day Replacement Policy</li>
                                </ul>
                            </Card>

                            <Card padding="lg" className={styles.card}>
                                <div className={`${styles.badge} ${styles.badgeC}`}>Grade C</div>
                                <h3>Fair Condition</h3>
                                <ul className={styles.list}>
                                    <li>30 Days Limited Warranty</li>
                                    <li>Device Functionality Only</li>
                                    <li>check-on-delivery available</li>
                                </ul>
                            </Card>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2>What is Covered?</h2>
                        <div className={styles.coverageList}>
                            <div className={styles.coverageItem}>
                                <span className={styles.icon}>✅</span>
                                <div>
                                    <strong>Hardware Defects</strong>
                                    <p>Touch screen issues, camera malfunction, sensor failures not caused by damage.</p>
                                </div>
                            </div>
                            <div className={styles.coverageItem}>
                                <span className={styles.icon}>✅</span>
                                <div>
                                    <strong>Network Connectivity</strong>
                                    <p>Issues with Wi-Fi, Bluetooth, or Signal reception (hardware related).</p>
                                </div>
                            </div>
                            <div className={styles.coverageItem}>
                                <span className={styles.icon}>✅</span>
                                <div>
                                    <strong>Battery Health</strong>
                                    <p>Significant abnormal drop in battery performance (for Grade A devices).</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2>What is NOT Covered?</h2>
                        <div className={styles.exclusionList}>
                            <div className={styles.exclusionItem}>
                                <span className={styles.icon}>❌</span>
                                <span>Physical damage (cracks, dents) after delivery</span>
                            </div>
                            <div className={styles.exclusionItem}>
                                <span className={styles.icon}>❌</span>
                                <span>Liquid damage or water exposure</span>
                            </div>
                            <div className={styles.exclusionItem}>
                                <span className={styles.icon}>❌</span>
                                <span>Software modifications (Jailbreak/Rooting)</span>
                            </div>
                            <div className={styles.exclusionItem}>
                                <span className={styles.icon}>❌</span>
                                <span>Normal wear and tear</span>
                            </div>
                        </div>
                    </section>

                    <section className={styles.ctaSection}>
                        <h2>Need to Claim Warranty?</h2>
                        <p>We make it simple. Just reach out to our support team.</p>
                        <Link href="/contact">
                            <Button variant="primary" className={styles.ctaButton}>
                                Contact Support
                            </Button>
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    )
}
