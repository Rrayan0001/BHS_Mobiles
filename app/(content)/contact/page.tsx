'use client'

import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from './page.module.css'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            setSubmitted(true)
        }, 1500)
    }

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Contact Us</h1>
                    <p className={styles.subtitle}>
                        We're here to help. Reach out to us for any queries.
                    </p>
                </div>
            </header>

            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.infoColumn}>
                        <div className={styles.infoGrid}>
                            <Card padding="lg" className={styles.infoCard}>
                                <div className={styles.icon}>📞</div>
                                <h3>Phone & WhatsApp</h3>
                                <p>+91 96325 64054</p>
                                <p className={styles.subText}>Mon-Sat, 10am - 8pm</p>
                            </Card>

                            <Card padding="lg" className={styles.infoCard}>
                                <div className={styles.icon}>✉️</div>
                                <h3>Email Us</h3>
                                <p>info@nawazmobiles.com</p>
                                <p className={styles.subText}>We reply within 24 hours</p>
                            </Card>

                            <Card padding="lg" className={styles.infoCard}>
                                <div className={styles.icon}>📷</div>
                                <h3>Instagram</h3>
                                <p>@nawaz_mobiles_5640</p>
                                <p className={styles.subText}>Follow for latest updates</p>
                            </Card>

                            <Card padding="lg" className={styles.infoCard}>
                                <div className={styles.icon}>📍</div>
                                <h3>Visit Us</h3>
                                <p>
                                    123 Market Street,<br />
                                    Bangalore, Karnataka 560001
                                </p>
                            </Card>
                        </div>
                    </div>

                    <div className={styles.formColumn}>
                        <Card padding="lg">
                            {submitted ? (
                                <div className={styles.successMessage}>
                                    <div className={styles.successIcon}>✅</div>
                                    <h3>Message Sent!</h3>
                                    <p>Thanks for reaching out. We'll get back to you shortly.</p>
                                    <Button variant="outline" onClick={() => setSubmitted(false)}>
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <h2 className={styles.formTitle}>Send a Message</h2>

                                    <Input
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                    />

                                    <Input
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                    />

                                    <Input
                                        label="Subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        fullWidth
                                    />

                                    <div className={styles.formGroup}>
                                        <label>Message</label>
                                        <textarea
                                            name="message"
                                            className={styles.textarea}
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        loading={loading}
                                    >
                                        Send Message
                                    </Button>
                                </form>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
