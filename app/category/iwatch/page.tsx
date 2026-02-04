'use client'

import React from 'react'
import { useCart } from '@/contexts/CartContext'
import styles from './watch.module.css'

const watches = [
    { id: 'w1', name: 'Watch Ultra 2 - GPS + Cellular', price: 79999, oldPrice: 89999, image: '⌚', variant: '49mm' },
    { id: 'w2', name: 'Watch Series 10 - GPS + Cellular', price: 54999, oldPrice: 64999, image: '⌚', variant: '46mm' },
    { id: 'w3', name: 'Watch Series 9 - GPS + Cellular', price: 47999, oldPrice: 57999, image: '⌚', variant: '45mm' },
    { id: 'w4', name: 'Watch Ultra 2', price: 64999, oldPrice: 74999, image: '⌚', variant: '49mm' },
    { id: 'w5', name: 'Watch SE (2nd Gen) - GPS + Cellular', price: 34999, oldPrice: 44999, image: '⌚', variant: '44mm' },
    { id: 'w6', name: 'Watch Series 8 - GPS', price: 39999, oldPrice: 49999, image: '⌚', variant: '45mm' },
]

export default function WatchPage() {
    const { addItem } = useCart()

    const handleAddToCart = (product: typeof watches[0]) => {
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
                    <h1 className={styles.bannerTitle}>Apple Watch</h1>
                    <p className={styles.bannerSubtitle}>Premium smartwatches collection</p>
                </div>
            </div>

            <div className={styles.filtersSection}>
                <div className="container">
                    <div className={styles.filtersBar}>
                        <div className={styles.filterChip}>Watch</div>
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
                    {watches.map((product) => (
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
