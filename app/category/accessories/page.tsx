'use client'

import React from 'react'
import { useCart } from '@/contexts/CartContext'
import styles from './accessories.module.css'

const accessories = [
    { id: 'acc1', name: 'MagSafe Charger - 15W', price: 3999, oldPrice: 4900, image: '🔌', variant: '15W' },
    { id: 'acc2', name: 'USB-C to Lightning Cable - 1m', price: 1999, oldPrice: 2900, image: '🔌', variant: '1m' },
    { id: 'acc3', name: 'iPhone 15 Pro Silicone Case', price: 4999, oldPrice: 5900, image: '📱', variant: 'Silicone' },
    { id: 'acc4', name: 'AirTag - 4 Pack', price: 9999, oldPrice: 11900, image: '🏷️', variant: '4 Pack' },
    { id: 'acc5', name: 'Apple Pencil (2nd Gen)', price: 11999, oldPrice: 13900, image: '✏️', variant: '2nd Gen' },
    { id: 'acc6', name: 'Magic Keyboard for iPad Pro', price: 29999, oldPrice: 34900, image: '⌨️', variant: 'iPad Pro' },
    { id: 'acc7', name: 'Watch Sport Band', price: 4999, oldPrice: 5900, image: '⌚', variant: 'Sport' },
    { id: 'acc8', name: 'iPhone 15 Clear Case', price: 3999, oldPrice: 4900, image: '📱', variant: 'Clear' },
    { id: 'acc9', name: 'USB-C Power Adapter - 20W', price: 1999, oldPrice: 2900, image: '🔌', variant: '20W' },
    { id: 'acc10', name: 'Screen Protector - Tempered Glass', price: 999, oldPrice: 1499, image: '🛡️', variant: 'Tempered' },
]

export default function AccessoriesPage() {
    const { addItem } = useCart()

    const handleAddToCart = (product: typeof accessories[0]) => {
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
                    <h1 className={styles.bannerTitle}>Accessories</h1>
                    <p className={styles.bannerSubtitle}>Essential accessories for your devices</p>
                </div>
            </div>

            <div className={styles.filtersSection}>
                <div className="container">
                    <div className={styles.filtersBar}>
                        <div className={styles.filterChip}>Accessories</div>
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
                    {accessories.map((product) => (
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
