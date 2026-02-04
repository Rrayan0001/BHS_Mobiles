'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import styles from './page.module.css'

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs = [
        {
            category: 'Orders & Shipping',
            items: [
                {
                    question: 'How long does shipping take?',
                    answer: 'We typically process orders within 24 hours. Delivery usually takes 3-5 business days depending on your location. You will receive a tracking link via SMS/Email once shipped.'
                },
                {
                    question: 'Can I track my order?',
                    answer: 'Yes, you can track your order status in real-time from the "My Orders" section in your account dashboard. We also send regular updates via email/SMS.'
                },
                {
                    question: 'Do you ship internationally?',
                    answer: 'Currently, we only ship within India to ensure the best service and warranty support.'
                }
            ]
        },
        {
            category: 'Product & Warranty',
            items: [
                {
                    question: 'Are the phones original?',
                    answer: 'Yes, all our devices are 100% genuine and undergo a rigorous 50-point quality check. We do not sell fake or first-copy products.'
                },
                {
                    question: 'What does "Refurbished" mean?',
                    answer: 'Refurbished means the device has been pre-owned but has been professionally tested, cleaned, and repaired (if necessary) to ensure it works perfectly. We grade them as A (Like New), B (Good), or C (Fair).'
                },
                {
                    question: 'How do I claim warranty?',
                    answer: 'Simply contact our support team with your order ID. If the issue is covered under warranty, we will arrange a pickup and repair or replace the device.'
                }
            ]
        },
        {
            category: 'Payments',
            items: [
                {
                    question: 'Is Cash on Delivery (COD) available?',
                    answer: 'Yes, we offer Cash on Delivery on most products. A small convenience fee may apply for COD orders.'
                },
                {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept all major Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and COD.'
                }
            ]
        }
    ]

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Frequently Asked Questions</h1>
                    <p className={styles.subtitle}>
                        Have questions? We have answers.
                    </p>
                </div>
            </header>

            <div className="container">
                <div className={styles.content}>
                    {faqs.map((section, sectionIdx) => (
                        <div key={sectionIdx} className={styles.section}>
                            <h2 className={styles.categoryTitle}>{section.category}</h2>
                            <div className={styles.faqList}>
                                {section.items.map((item, itemIdx) => {
                                    const globalIndex = sectionIdx * 10 + itemIdx
                                    const isOpen = openIndex === globalIndex

                                    return (
                                        <div
                                            key={itemIdx}
                                            className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}
                                        >
                                            <button
                                                className={styles.question}
                                                onClick={() => toggleAccordion(globalIndex)}
                                            >
                                                {item.question}
                                                <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
                                            </button>
                                            <div className={styles.answer}>
                                                <div className={styles.answerContent}>
                                                    {item.answer}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    <div className={styles.cta}>
                        <h2>Still have questions?</h2>
                        <p>Can't find what you're looking for? Chat with our team.</p>
                        <Link href="/contact">
                            <Button variant="primary">Contact Support</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
