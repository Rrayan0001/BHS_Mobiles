'use client'

import React from 'react'
import { useCart } from '@/contexts/CartContext'
import styles from './products.module.css'

// Mock product data - replace with real data from Supabase
const products = [
    { id: 'p1', name: 'Watch Ultra 2 - GPS + Cellular', price: 79999, oldPrice: 89999, image: '⌚', category: 'Watch', variant: '49mm' },
    { id: 'p2', name: 'Watch Series 10 - GPS + Cellular', price: 54999, oldPrice: 64999, image: '⌚', category: 'Watch', variant: '46mm' },
    { id: 'p3', name: 'iPhone 16 - 256GB', price: 79999, oldPrice: 99999, image: '📱', category: 'iPhone', variant: '256GB' },
    { id: 'p4', name: 'Watch Series 9 - GPS + Cellular', price: 47999, oldPrice: 57999, image: '⌚', category: 'Watch', variant: '45mm' },
    { id: 'p5', name: 'iPhone 13 Pro - 256GB', price: 59999, oldPrice: 79999, image: '📱', category: 'iPhone', variant: '256GB' },
    { id: 'p6', name: 'Watch Ultra 2', price: 64999, oldPrice: 74999, image: '⌚', category: 'Watch', variant: '49mm' },
    { id: 'p7', name: 'iPhone 15 Pro - 256GB', price: 89999, oldPrice: 119999, image: '📱', category: 'iPhone', variant: '256GB' },
    { id: 'p8', name: 'iPhone 14 - 128GB', price: 54999, oldPrice: 69999, image: '📱', category: 'iPhone', variant: '128GB' },
    { id: 'p9', name: 'iPhone 15 Pro - 512GB', price: 109999, oldPrice: 139999, image: '📱', category: 'iPhone', variant: '512GB' },
    { id: 'p10', name: 'Watch SE (2nd Gen) - GPS + WiFi + BT + Cellular', price: 34999, oldPrice: 44999, image: '⌚', category: 'Watch', variant: '44mm' },
    { id: 'p11', name: 'Samsung S24 Ultra - 256GB', price: 84999, oldPrice: 109999, image: '📱', category: 'Samsung', variant: '256GB' },
    { id: 'p12', name: 'iPhone 15 - 256GB', price: 74999, oldPrice: 94999, image: '📱', category: 'iPhone', variant: '256GB' },
    { id: 'p13', name: 'Samsung S24 Ultra - 512GB', price: 94999, oldPrice: 119999, image: '📱', category: 'Samsung', variant: '512GB' },
    { id: 'p14', name: 'iPhone 16 Pro - 256GB', price: 119999, oldPrice: 149999, image: '📱', category: 'iPhone', variant: '256GB' },
    { id: 'p15', name: 'iPhone 15 Pro - 256GB', price: 89999, oldPrice: 119999, image: '📱', category: 'iPhone', variant: '256GB' },
    { id: 'p16', name: 'iPhone 7 Plus - 256GB', price: 19999, oldPrice: 29999, image: '📱', category: 'iPhone', variant: '256GB' },
]

export default function ProductsPage() {
    const { addItem } = useCart()

    const handleAddToCart = (product: typeof products[0]) => {
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
                    {products.map((product) => (
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
