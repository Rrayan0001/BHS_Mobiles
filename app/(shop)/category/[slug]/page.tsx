'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import styles from './page.module.css'

interface Product {
    id: string
    title: string
    slug: string
    price: number
    compare_price: number | null
    stock: number
    condition: string
    images: string[]
    category: {
        id: string
        name: string
        display_name: string
        slug: string
    } | null
}

function CategoryContent() {
    const params = useParams()
    const slug = params.slug as string

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('newest')

    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')

    useEffect(() => {
        fetchProducts()
    }, [slug, sortBy])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const sortParam = sortBy === 'price_asc' ? 'sort=price&order=asc'
                : sortBy === 'price_desc' ? 'sort=price&order=desc'
                    : 'sort=created_at&order=desc'

            const response = await fetch(`/api/products?category=${slug}&${sortParam}`)
            const data = await response.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Failed to fetch products:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className="container">
                    <div className={styles.headerContent}>
                        <div>
                            <h1 className={styles.title}>{categoryName}</h1>
                            <p className={styles.subtitle}>
                                Certified refurbished devices with warranty
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <main className={styles.main}>
                    <div className={styles.toolbar}>
                        <p className={styles.resultCount}>
                            {loading ? 'Loading...' : `${products.length} products found`}
                        </p>
                        <div className={styles.sortWrapper}>
                            <label htmlFor="sort" className={styles.sortLabel}>
                                Sort by:
                            </label>
                            <select
                                id="sort"
                                className={styles.sortSelect}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>⏳</div>
                            <h3>Loading products...</h3>
                        </div>
                    ) : products.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📦</div>
                            <h3>No products found</h3>
                            <p>
                                We&apos;re currently updating our inventory. Check back soon or browse other
                                categories.
                            </p>
                            <Link href="/products">
                                <Button variant="primary">Browse All Products</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.productGrid}>
                            {products.map((product) => {
                                const discount = product.compare_price
                                    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
                                    : 0

                                return (
                                    <Link key={product.id} href={`/product/${product.slug || product.id}`} className={styles.productCardLink}>
                                        <div className={styles.productCard || ''}>
                                            <div style={{
                                                position: 'relative',
                                                width: '100%',
                                                aspectRatio: '1',
                                                background: 'var(--color-neutral-100)',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.title}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: '3rem' }}>📱</span>
                                                )}
                                                {discount > 0 && (
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '8px',
                                                        right: '8px',
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600'
                                                    }}>
                                                        {discount}% OFF
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ padding: '0.75rem 0' }}>
                                                <h3 style={{
                                                    fontSize: '0.95rem',
                                                    fontWeight: '600',
                                                    color: 'var(--color-neutral-800)',
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    {product.title}
                                                </h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{
                                                        fontSize: '1.1rem',
                                                        fontWeight: '700',
                                                        color: 'var(--color-neutral-900)'
                                                    }}>
                                                        ₹{product.price.toLocaleString()}
                                                    </span>
                                                    {product.compare_price && product.compare_price > product.price && (
                                                        <span style={{
                                                            fontSize: '0.85rem',
                                                            color: 'var(--color-neutral-400)',
                                                            textDecoration: 'line-through'
                                                        }}>
                                                            ₹{product.compare_price.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                                {product.stock > 0 && product.stock <= 5 && (
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        color: '#ef4444',
                                                        fontWeight: '500',
                                                        marginTop: '0.25rem',
                                                        display: 'block'
                                                    }}>
                                                        Only {product.stock} left
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default function CategoryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CategoryContent />
        </Suspense>
    )
}
