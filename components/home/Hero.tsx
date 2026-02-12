'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './Hero.module.css'

interface Banner {
    id: string
    title: string
    subtitle: string | null
    image_url: string
    link_url: string | null
    button_text: string
    is_active: boolean
    display_order: number
}

export default function Hero() {
    const [banners, setBanners] = useState<Banner[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch('/api/banners')
                const data = await response.json()
                setBanners(data.banners || [])
            } catch (error) {
                console.error('Failed to fetch banners:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBanners()
    }, [])

    // Auto-rotate banners
    useEffect(() => {
        if (banners.length <= 1) return
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % banners.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [banners.length])

    // If no banners from DB, show default static hero
    if (loading || banners.length === 0) {
        return (
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <div className={styles.textContent}>
                            <h1 className={styles.heroTitle}>
                                Your kid will drop it.<br />
                                <span className={styles.italic}>Pay less.</span>
                            </h1>
                            <p className={styles.heroSubtitle}>
                                <b>CRAZY OFFER:</b> Grab the iPhone 15 for a price that makes no sense! Up to 70% OFF!
                            </p>
                            <Link href="/products" className={styles.heroBtn}>
                                Save now
                            </Link>
                        </div>
                        <div className={styles.imageContent}>
                            <div className={styles.phonesWrapper}>
                                <div className={styles.phone} style={{ '--color': '#333' } as any}></div>
                                <div className={styles.phone} style={{ '--color': '#FAD5C5' } as any}></div>
                                <div className={styles.phone} style={{ '--color': '#E5E5EA' } as any}></div>
                                <div className={styles.phone} style={{ '--color': '#F2F4C3' } as any}></div>
                                <div className={styles.phone} style={{ '--color': '#A6C5DB' } as any}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    const banner = banners[currentIndex]

    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.heroContent}>
                    <div className={styles.textContent}>
                        <h1 className={styles.heroTitle}>
                            {banner.title}
                        </h1>
                        {banner.subtitle && (
                            <p className={styles.heroSubtitle}>
                                {banner.subtitle}
                            </p>
                        )}
                        <Link
                            href={banner.link_url || '/products'}
                            className={styles.heroBtn}
                        >
                            {banner.button_text || 'Shop Now'}
                        </Link>
                    </div>
                    <div className={styles.imageContent}>
                        <img
                            src={banner.image_url}
                            alt={banner.title}
                            className={styles.bannerImage}
                        />
                    </div>
                </div>

                {banners.length > 1 && (
                    <div className={styles.dots}>
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Go to banner ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
