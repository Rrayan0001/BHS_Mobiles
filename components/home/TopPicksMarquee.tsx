'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './TopPicksMarquee.module.css'

interface Product {
    id: string
    title: string
    price: number
    compare_price: number | null
    images: string[]
    slug: string
}

const bgColors = ['#F5F0FF', '#FFF0F0', '#F0FFF4', '#FFF8F0', '#F0F8FF', '#FFFAF0']

export default function TopPicksMarquee() {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isPaused, setIsPaused] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const isDragging = useRef(false)

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await fetch('/api/products?featured=true&limit=8')
                const data = await response.json()
                setProducts(data.products || [])
            } catch (error) {
                console.error('Failed to fetch featured products:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchFeatured()
    }, [])

    // Only duplicate products for scrolling if there are more than 6
    const shouldScroll = products.length > 6
    const displayProducts = shouldScroll
        ? [...products, ...products, ...products, ...products]
        : products

    useEffect(() => {
        const scrollContainer = scrollRef.current
        if (!scrollContainer || products.length === 0 || !shouldScroll) return

        let animationFrameId: number
        const speed = 1.0

        const animate = () => {
            if (!isPaused && !isDragging.current) {
                if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth / 2)) {
                    scrollContainer.scrollLeft -= (scrollContainer.scrollWidth / 2)
                } else {
                    scrollContainer.scrollLeft += speed
                }

                const maxScroll = scrollContainer.scrollWidth / 2
                if (scrollContainer.scrollLeft >= maxScroll) {
                    scrollContainer.scrollLeft = 0
                }
            }
            animationFrameId = requestAnimationFrame(animate)
        }

        animationFrameId = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrameId)
    }, [isPaused, products])

    const manualScroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            setIsPaused(true)
            const scrollAmount = 300
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
            setTimeout(() => setIsPaused(false), 2000)
        }
    }

    if (loading) {
        return (
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.headerRow}>
                        <div style={{ height: '40px', width: '300px', background: '#e2e8f0', borderRadius: '8px' }}></div>
                        <div className={styles.navButtons}>
                            <div className={styles.navBtn}></div>
                            <div className={styles.navBtn}></div>
                        </div>
                    </div>
                </div>
                <div className={styles.scrollContainer} style={{ overflow: 'hidden' }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={styles.card} style={{ borderColor: '#e2e8f0' }}>
                            <div className={styles.cardTop} style={{ background: '#f8fafc' }}></div>
                            <div className={styles.cardBottom}>
                                <div style={{ height: '24px', width: '80%', background: '#e2e8f0', marginBottom: '12px', borderRadius: '4px' }}></div>
                                <div style={{ height: '24px', width: '40%', background: '#e2e8f0', marginBottom: '24px', borderRadius: '4px' }}></div>
                                <div style={{ height: '40px', width: '120px', background: '#e2e8f0', borderRadius: '20px', marginTop: 'auto' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )
    }

    if (products.length === 0) {
        return null
    }

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.headerRow}>
                    <h2 className={styles.title}>Top Picks for You</h2>
                    <div className={styles.navButtons}>
                        <button onClick={() => manualScroll('left')} className={styles.navBtn} aria-label="Scroll Left">
                            ←
                        </button>
                        <button onClick={() => manualScroll('right')} className={styles.navBtn} aria-label="Scroll Right">
                            →
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={styles.scrollContainer}
                ref={scrollRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => { isDragging.current = true; setIsPaused(true) }}
                onTouchEnd={() => { isDragging.current = false; setTimeout(() => setIsPaused(false), 2000) }}
            >
                {displayProducts.map((product, index) => {
                    const discount = product.compare_price && product.compare_price > product.price
                        ? `${Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF`
                        : null
                    const bgColor = bgColors[index % bgColors.length]

                    return (
                        <Link
                            key={`${product.id}-${index}`}
                            href={`/product/${product.slug || product.id}`}
                            className={styles.card}
                        >
                            <div className={styles.cardTop}>
                                {discount && (
                                    <div className={styles.discountBadge}>
                                        {discount}
                                    </div>
                                )}
                                <div className={styles.imagePlaceholder}>
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: '3rem' }}>📱</span>
                                    )}
                                </div>
                            </div>

                            {/* Using inline style for dynamic background color, but relying on CSS class for layout */}
                            <div className={styles.cardBottom} style={{ backgroundColor: bgColor }}>
                                <h3 className={styles.productName}>{product.title}</h3>
                                <div className={styles.pricing}>
                                    <span className={styles.currentPrice}>₹{product.price.toLocaleString()}</span>
                                    {product.compare_price && product.compare_price > product.price && (
                                        <span className={styles.oldPrice}>₹{product.compare_price.toLocaleString()}</span>
                                    )}
                                </div>
                                <div className={styles.viewDetailsBtn}>
                                    View Details →
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
