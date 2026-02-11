'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import styles from './products.module.css'

interface Product {
    id: string
    title: string
    slug: string
    price: number
    compare_price: number | null
    stock: number
    condition: string
    status: string
    images: string[]
    category: {
        id: string
        name: string
        display_name: string
        slug: string
    } | null
}

export default function ProductsPage() {
    const { addItem } = useCart()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('newest')

    useEffect(() => {
        fetchProducts()
    }, [sortBy])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const sortParam = sortBy === 'price_asc' ? 'sort=price&order=asc'
                : sortBy === 'price_desc' ? 'sort=price&order=desc'
                    : 'sort=created_at&order=desc'

            const response = await fetch(`/api/products?${sortParam}`)
            const data = await response.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Failed to fetch products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = (product: Product) => {
        addItem({
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.images?.[0] || '/placeholder.png',
            variant: ''
        })
    }

    return (
        <div className={styles.page}>
            {/* Hero Banner */}
            <div className={styles.banner}>
                <div className="container">
                    <h1 className={styles.bannerTitle}>All Products</h1>
                    <p className={styles.bannerSubtitle}>The only marketplace you'll ever need</p>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filtersSection}>
                <div className="container">
                    <div className={styles.filtersBar}>
                        <p style={{ color: 'var(--color-neutral-600)', fontSize: '0.9rem' }}>
                            {loading ? 'Loading...' : `${products.length} products found`}
                        </p>
                        <div className={styles.sortBy}>
                            <label>Sort by:</label>
                            <select
                                className={styles.select}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-neutral-500)' }}>
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                        <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-neutral-800)' }}>No products yet</h3>
                        <p style={{ color: 'var(--color-neutral-500)' }}>Check back soon for new products!</p>
                    </div>
                ) : (
                    <div className={styles.productsGrid}>
                        {products.map((product) => {
                            const discount = product.compare_price
                                ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
                                : 0

                            return (
                                <div key={product.id} className={styles.productCard}>
                                    <Link href={`/product/${product.slug || product.id}`}>
                                        <div className={styles.productImage}>
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                                />
                                            ) : (
                                                <span style={{ fontSize: '4rem' }}>📱</span>
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
                                    </Link>

                                    <div className={styles.productInfo}>
                                        <h3 className={styles.productName}>{product.title}</h3>
                                        {product.category && (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                {product.category.display_name || product.category.name}
                                            </span>
                                        )}
                                        <div className={styles.priceRow}>
                                            <span className={styles.currentPrice}>₹{product.price.toLocaleString()}</span>
                                            {product.compare_price && product.compare_price > product.price && (
                                                <span className={styles.oldPrice}>₹{product.compare_price.toLocaleString()}</span>
                                            )}
                                        </div>
                                        <button
                                            className={styles.addToCartBtn}
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            🛒 Add to cart
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
