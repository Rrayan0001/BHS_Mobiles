'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './TopPicksMarquee.module.css'

const products = [
    {
        id: 'tp1',
        name: 'Samsung S24 Ultra - 256GB',
        price: 68999,
        priceDisplay: '68,999',
        oldPrice: '1,03,499',
        discount: '50% Off',
        bgColor: '#ffccb3',
    },
    {
        id: 'tp2',
        name: 'Samsung S25 Ultra - 256GB',
        price: 82999,
        priceDisplay: '82,999',
        oldPrice: '1,24,499',
        discount: '50% Off',
        bgColor: '#e6ccff',
    },
    {
        id: 'tp3',
        name: 'iPhone 17 - 256GB',
        price: 74999,
        priceDisplay: '74,999',
        oldPrice: '1,04,999',
        discount: '40% Off',
        bgColor: '#ffccb3',
    },
    {
        id: 'tp4',
        name: 'Watch Series Ultra 3 (BLACK EDIT...)',
        price: 56999,
        priceDisplay: '56,999',
        oldPrice: '79,799',
        discount: '40% Off',
        bgColor: '#ffccb3',
    },
    {
        id: 'tp5',
        name: 'Watch Series Ultra',
        price: 42999,
        priceDisplay: '42,999',
        oldPrice: '60,199',
        discount: '40% Off',
        bgColor: '#e6ccff',
    },
    {
        id: 'tp6',
        name: 'AirPods Pro 2',
        price: 18999,
        priceDisplay: '18,999',
        oldPrice: '26,900',
        discount: '30% Off',
        bgColor: '#d4f672',
    },
]

export default function TopPicksMarquee() {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isPaused, setIsPaused] = useState(false)
    const isDragging = useRef(false)

    // Duplicate products to create seamless loop illusion
    const displayProducts = [...products, ...products, ...products, ...products]

    useEffect(() => {
        const scrollContainer = scrollRef.current
        if (!scrollContainer) return

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
    }, [isPaused])

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
                {displayProducts.map((product, index) => (
                    <Link
                        key={`${product.id}-${index}`}
                        href={`/products/${product.id}`}
                        className={styles.card}
                    >
                        <div className={styles.cardTop}>
                            <div className={styles.discountBadge}>
                                {product.discount}
                            </div>
                            <div className={styles.imagePlaceholder}>
                                <span style={{ fontSize: '3rem' }}>📱</span>
                            </div>
                        </div>

                        <div className={styles.cardBottom} style={{ backgroundColor: product.bgColor }}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <div className={styles.pricing}>
                                <span className={styles.currentPrice}>Rs. {product.priceDisplay}</span>
                                <span className={styles.oldPrice}>{product.oldPrice}</span>
                            </div>
                            <div className={styles.viewDetailsBtn}>
                                View Details →
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

