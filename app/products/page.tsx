'use client'

import React, { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { getMaxAllowedQuantity, resolvePurchaseMode } from '@/lib/cartRules'
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

function ProductsContent() {
    const { addItem } = useCart()
    const searchParams = useSearchParams()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('newest')
    const searchQuery = searchParams.get('search')?.trim() || ''

    useEffect(() => {
        fetchProducts()
    }, [sortBy, searchQuery])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()

            if (sortBy === 'price_asc') {
                params.set('sort', 'price')
                params.set('order', 'asc')
            } else if (sortBy === 'price_desc') {
                params.set('sort', 'price')
                params.set('order', 'desc')
            } else {
                params.set('sort', 'created_at')
                params.set('order', 'desc')
            }

            if (searchQuery) {
                params.set('search', searchQuery)
            }

            const response = await fetch(`/api/products?${params.toString()}`)
            const data = await response.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Failed to fetch products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = (product: Product) => {
        const purchaseMode = resolvePurchaseMode(product)
        const maxQuantity = getMaxAllowedQuantity(purchaseMode, product.stock)

        if (maxQuantity < 1) return

        addItem({
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.images?.[0] || '/placeholder.png',
            variant: '',
            purchaseMode,
            maxQuantity,
            quantity: 1
        })
    }

    return (
        <div className={styles.page}>
            {/* Hero Banner */}
            <div className={styles.banner}>
                <div className="container">
                    <h1 className={styles.bannerTitle}>All Products</h1>
                    <p className={styles.bannerSubtitle}>Premium smartphones at competitive prices</p>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filtersSection}>
                <div className="container">
                    <div className={styles.filtersBar}>
                        <p className={styles.productCount}>
                            {loading
                                ? 'Loading...'
                                : searchQuery
                                    ? `${products.length} result${products.length === 1 ? '' : 's'} for "${searchQuery}"`
                                    : `${products.length} products found`}
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
                    <div className={styles.loadingState}>
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.productEmoji}>📦</div>
                        {searchQuery ? (
                            <>
                                <h3 className={styles.emptyTitle}>
                                    No products found
                                </h3>
                                <p className={styles.emptyText}>
                                    No matches for "{searchQuery}". Try different keywords.
                                </p>
                            </>
                        ) : (
                            <>
                                <h3 className={styles.emptyTitle}>No products yet</h3>
                                <p className={styles.emptyText}>Check back soon for new products!</p>
                            </>
                        )}
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
                                                    className={styles.productImageEl}
                                                />
                                            ) : (
                                                <span className={styles.productEmoji}>📱</span>
                                            )}
                                            {discount > 0 && (
                                                <span className={styles.discountBadge}>
                                                    {discount}% OFF
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    <div className={styles.productInfo}>
                                        <h3 className={styles.productName}>{product.title}</h3>
                                        {product.category && (
                                            <span className={styles.categoryTag}>
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
                                            disabled={product.stock < 1}
                                        >
                                            {product.stock < 1 ? 'Out of stock' : '🛒 Add to cart'}
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

function ProductsLoadingFallback() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.loadingState}>
                    Loading products...
                </div>
            </div>
        </div>
    )
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<ProductsLoadingFallback />}>
            <ProductsContent />
        </Suspense>
    )
}
