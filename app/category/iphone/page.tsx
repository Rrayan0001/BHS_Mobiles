'use client'

import React from 'react'
import { useCart } from '@/contexts/CartContext'
import styles from './iphone.module.css'

// Mock iPhone product data - replace with real data from Supabase
const iphones = [
    { id: '1', name: 'iPhone 15 - 128GB', price: 29999, oldPrice: 44999, image: '📱', colors: ['#ff0000', '#0066cc', '#000000', '#00cc66'] },
    { id: '2', name: 'iPhone 13 Pro - 128GB', price: 39999, oldPrice: 64999, image: '📱', colors: ['#c9b8a8', '#1a1a1a', '#00cc66', '#ffffff'] },
    { id: '3', name: 'iPhone 13 Pro - 256GB', price: 44999, oldPrice: 64999, image: '📱', colors: ['#1a1a1a', '#c9b8a8', '#ffffff', '#00cc66'] },
    { id: '4', name: 'iPhone 15 - 128GB', price: 44999, oldPrice: 59999, image: '📱', colors: ['#1a1a1a', '#ffffff', '#ffcccc', '#c9b8a8'] },
    { id: '5', name: 'iPhone 15 Pro - 256GB', price: 84999, oldPrice: 99999, image: '📱', colors: ['#1a1a1a', '#ffffff', '#c9b8a8', '#0066cc'] },
    { id: '6', name: 'iPhone 17 - 256GB', price: 74999, oldPrice: 94999, image: '📱', colors: ['#1a1a1a', '#c9b8a8', '#ffffff', '#0066cc'] },
    { id: '7', name: 'iPhone 16 Pro - 128GB', price: 89999, oldPrice: 119999, image: '📱', colors: ['#1a1a1a', '#c9b8a8', '#ffffff', '#8b7355'] },
    { id: '8', name: 'iPhone 14 Pro - 512GB', price: 89999, oldPrice: 119999, image: '📱', colors: ['#1a1a1a', '#c9b8a8', '#ffffff', '#8b7355'] },
    { id: '9', name: 'iPhone 7 Plus - 256GB', price: 9151, oldPrice: null, image: '📱', colors: ['#1a1a1a', '#ff6600', '#0066cc'] },
    { id: '10', name: 'iPhone 7 Plus Max - 256GB', price: 9151, oldPrice: null, image: '📱', colors: ['#1a1a1a', '#ff6600'] },
]

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
                                    {product.colors.map((color, idx) => (
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
