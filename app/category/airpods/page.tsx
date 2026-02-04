'use client'

import React from 'react'
import { useCart } from '@/contexts/CartContext'
import styles from './airpods.module.css'

const airpods = [
    { id: 'ap1', name: 'AirPods Pro 2 - USB-C', price: 18999, oldPrice: 26900, image: '🎧', variant: 'USB-C' },
    { id: 'ap2', name: 'AirPods 3rd Generation', price: 14999, oldPrice: 19900, image: '🎧', variant: '3rd Gen' },
    { id: 'ap3', name: 'AirPods Max - Silver', price: 49999, oldPrice: 59900, image: '🎧', variant: 'Silver' },
    { id: 'ap4', name: 'AirPods 2nd Generation', price: 9999, oldPrice: 14900, image: '🎧', variant: '2nd Gen' },
    { id: 'ap5', name: 'AirPods Pro 2 - Lightning', price: 17999, oldPrice: 24900, image: '🎧', variant: 'Lightning' },
    { id: 'ap6', name: 'AirPods Max - Space Gray', price: 49999, oldPrice: 59900, image: '🎧', variant: 'Space Gray' },
]

export default function AirpodsPage() {
    const { addItem } = useCart()

    const handleAddToCart = (product: typeof airpods[0]) => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            variant: product.variant
        })
    }

    return (
        <div className={styles.page}>
            <div className={styles.banner}>
                <div className="container">
                    <h1 className={styles.bannerTitle}>AirPods</h1>
                    <p className={styles.bannerSubtitle}>Wireless audio excellence</p>
                </div>
            </div>

            <div className={styles.filtersSection}>
                <div className="container">
                    <div className={styles.filtersBar}>
                        <div className={styles.filterChip}>Airpods</div>
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

            <div className="container">
                <div className={styles.productsGrid}>
                    {airpods.map((product) => (
                        <div key={product.id} className={styles.productCard}>
                            <div className={styles.wishlistIcon}>♡</div>
                            <div className={styles.productImage}>
                                <span style={{ fontSize: '4rem' }}>{product.image}</span>
                            </div>
                            <div className={styles.productInfo}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <div className={styles.priceRow}>
                                    <span className={styles.currentPrice}>Rs. {product.price.toLocaleString()}</span>
                                    <span className={styles.oldPrice}>₹{product.oldPrice.toLocaleString()}</span>
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
