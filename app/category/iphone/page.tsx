'use client'

import React from 'react'
import { useCart } from '@/contexts/CartContext'
import styles from './iphone.module.css'

// Mock iPhone product data - replace with real data from Supabase
const iphones: any[] = []

export default function IPhonePage() {
    const { addItem } = useCart()

    const handleAddToCart = (product: typeof iphones[0]) => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            variant: '128GB'
        })
    }

    return (
        <div className={styles.page}>
            {/* Hero Banner */}
            <div className={styles.banner}>
                <div className="container">
                    <h1 className={styles.bannerTitle}>iPhone</h1>
                    <p className={styles.bannerSubtitle}>Our latest collection of iPhones</p>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filtersSection}>
                <div className="container">
                    <div className={styles.filtersBar}>
                        <div className={styles.filterChip}>
                            iPhone
                        </div>
                        <div className={styles.sortBy}>
                            <label>Sort by:</label>
                            <select className={styles.select}>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest First</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container">
                <div className={styles.productsGrid}>
                    {iphones.map((product) => (
                        <div key={product.id} className={styles.productCard}>
                            <div className={styles.wishlistIcon}>♡</div>

                            <div className={styles.productImage}>
                                <span style={{ fontSize: '4rem' }}>{product.image}</span>
                            </div>

                            <div className={styles.productInfo}>
                                <h3 className={styles.productName}>{product.name}</h3>

                                {/* Color Options */}
                                <div className={styles.colorOptions}>
                                    {product.colors.map((color: string, idx: number) => (
                                        <div
                                            key={idx}
                                            className={styles.colorDot}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        ></div>
                                    ))}
                                </div>

                                <div className={styles.priceRow}>
                                    <span className={styles.currentPrice}>Rs. {product.price.toLocaleString()}</span>
                                    {product.oldPrice && (
                                        <span className={styles.oldPrice}>₹{product.oldPrice.toLocaleString()}</span>
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
                    ))}
                </div>
            </div>
        </div>
    )
}
