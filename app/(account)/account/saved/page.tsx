'use client'

import React from 'react'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import Button from '@/components/ui/Button'
import styles from './page.module.css'

export default function SavedItemsPage() {
    // Mock data
    const savedProducts = [
        {
            id: 'prod_1',
            title: 'iPhone 13 128GB - Midnight',
            price: 45999,
            compare_at_price: 59900,
            condition_grade: 'A',
            stock_quantity: 5,
            description: 'Excellent condition iPhone 13.',
            images: [{ url: '/placeholder.jpg', alt: 'iPhone 13' }]
        },
        {
            id: 'prod_2',
            title: 'Samsung Galaxy S21 FE 5G',
            price: 29999,
            compare_at_price: 49999,
            condition_grade: 'B',
            stock_quantity: 0,
            description: 'Good condition with minor scratches.',
            images: [{ url: '/placeholder.jpg', alt: 'Samsung S21' }]
        }
    ]

    if (savedProducts.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>❤️</div>
                <h2>No saved items yet</h2>
                <p>Items you save will appear here for easy access.</p>
                <Link href="/">
                    <Button variant="primary">Start Shopping</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Saved Items</h1>

            <div className={styles.grid}>
                {savedProducts.map((product) => (
                    <div key={product.id} className={styles.cardWrapper}>
                        <ProductCard product={product as any} />
                        <button className={styles.removeButton} aria-label="Remove from saved">
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
