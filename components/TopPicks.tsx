'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/StarRating'
import styles from './TopPicks.module.css'

interface Product {
    id: string
    title: string
    price: number
    compare_price: number | null
    images: string[]
    avg_rating: number
    review_count: number
    status: string
    slug: string
}

export default function TopPicks() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFeaturedProducts()
    }, [])

    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch('/api/products?featured=true&limit=6')
            const data = await response.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Failed to fetch featured products:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className={styles.loading}>Loading top picks...</div>
    }

    if (products.length === 0) {
        return null
    }

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>Top Picks</h2>
                <p className={styles.subtitle}>Our handpicked selection of the best products</p>

                <div className={styles.grid}>
                    {products.map((product) => (
                        <Link href={`/product/${product.slug}`} key={product.id}>
                            <Card className={styles.productCard} hover>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={product.images[0] || '/placeholder.png'}
                                        alt={product.title}
                                        className={styles.image}
                                    />
                                    {product.compare_price && product.compare_price > product.price && (
                                        <Badge variant="error" className={styles.discountBadge}>
                                            {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                                        </Badge>
                                    )}
                                </div>
                                <div className={styles.content}>
                                    <h3 className={styles.productTitle}>{product.title}</h3>

                                    {product.review_count > 0 && (
                                        <div className={styles.rating}>
                                            <StarRating
                                                rating={product.avg_rating}
                                                size="sm"
                                                showCount
                                                count={product.review_count}
                                            />
                                        </div>
                                    )}

                                    <div className={styles.priceRow}>
                                        <span className={styles.price}>₹{product.price.toLocaleString()}</span>
                                        {product.compare_price && product.compare_price > product.price && (
                                            <span className={styles.comparePrice}>
                                                ₹{product.compare_price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
