'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './TopPicksMarquee.module.css'

const products: any[] = []

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

