'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ConditionBadge from '@/components/product/ConditionBadge'
import styles from './page.module.css'

export default function ProductDetailPage() {
    const params = useParams()
    const slug = params.slug as string

    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    // Mock product data - will be replaced with Supabase query
    const product = {
        id: slug,
        title: 'iPhone 13 Pro 128GB - Sierra Blue',
        description: 'Fully tested and certified refurbished iPhone 13 Pro in excellent condition. Includes original box and accessories.',
        price: 45999,
        compare_at_price: 54999,
        stock_quantity: 3,
        condition_grade: 'A' as const,
        warranty_months: 6,
        sku: 'IP13P-128-SB-A',
        images: [
            { url: '/placeholder.jpg', alt: 'Front view', is_primary: true },
            { url: '/placeholder.jpg', alt: 'Back view', is_primary: false },
            { url: '/placeholder.jpg', alt: 'Side view', is_primary: false },
        ],
        attributes: [
            { label: 'Brand', value: 'Apple' },
            { label: 'Model', value: 'iPhone 13 Pro' },
            { label: 'Storage', value: '128GB' },
            { label: 'RAM', value: '6GB' },
            { label: 'Color', value: 'Sierra Blue' },
            { label: 'Battery Health', value: '95%' },
            { label: 'IMEI', value: '123456789012345' },
            { label: 'Accessories', value: 'Charger, Cable, Box' },
        ],
    }

    const discount = product.compare_at_price
        ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
        : 0

    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.breadcrumbs}>
                    <a href="/">Home</a>
                    <span>/</span>
                    <a href="/category/smartphones">Smartphones</a>
                    <span>/</span>
                    <span>{product.title}</span>
                </div>

                <div className={styles.layout}>
                    <div className={styles.gallery}>
                        <div className={styles.mainImage}>
                            <div className={styles.imageWrapper}>
                                <div className={styles.imagePlaceholder}>
                                    <span className={styles.placeholderIcon}>📱</span>
                                    <p className={styles.placeholderText}>Product Image</p>
                                </div>
                            </div>
                            {discount > 0 && (
                                <div className={styles.discountBadge}>-{discount}% OFF</div>
                            )}
                        </div>

                        <div className={styles.thumbnails}>
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailActive : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <div className={styles.thumbnailPlaceholder}>
                                        <span>📷</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.details}>
                        <div className={styles.header}>
                            <div className={styles.badges}>
                                <Badge variant="success" size="md">
                                    Grade {product.condition_grade}
                                </Badge>
                                <Badge variant="neutral" size="sm">
                                    SKU: {product.sku}
                                </Badge>
                            </div>
                            {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                                <span className={styles.lowStock}>
                                    Only {product.stock_quantity} left in stock
                                </span>
                            )}
                        </div>

                        <h1 className={styles.title}>{product.title}</h1>

                        <div className={styles.pricing}>
                            <div className={styles.priceWrapper}>
                                <span className={styles.price}>
                                    ₹{product.price.toLocaleString('en-IN')}
                                </span>
                                {product.compare_at_price && (
                                    <span className={styles.comparePrice}>
                                        ₹{product.compare_at_price.toLocaleString('en-IN')}
                                    </span>
                                )}
                            </div>
                            {discount > 0 && (
                                <span className={styles.savings}>
                                    You save ₹{(product.compare_at_price - product.price).toLocaleString('en-IN')} ({discount}%)
                                </span>
                            )}
                        </div>

                        <p className={styles.description}>{product.description}</p>

                        <div className={styles.conditionSection}>
                            <ConditionBadge grade={product.condition_grade} showDetails />
                        </div>

                        <div className={styles.actions}>
                            <div className={styles.quantitySelector}>
                                <label htmlFor="quantity">Quantity:</label>
                                <div className={styles.quantityControls}>
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <input
                                        id="quantity"
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        min="1"
                                        max={product.stock_quantity}
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                        disabled={quantity >= product.stock_quantity}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className={styles.buttons}>
                                <Button variant="primary" size="lg" fullWidth>
                                    Add to Cart
                                </Button>
                                <Button variant="secondary" size="lg" fullWidth>
                                    Buy Now
                                </Button>
                            </div>
                        </div>

                        <div className={styles.trustSignals}>
                            <div className={styles.trustItem}>
                                <span className={styles.trustIcon}>🛡️</span>
                                <div>
                                    <strong>{product.warranty_months} Months Warranty</strong>
                                    <p>Comprehensive coverage included</p>
                                </div>
                            </div>
                            <div className={styles.trustItem}>
                                <span className={styles.trustIcon}>↩️</span>
                                <div>
                                    <strong>14-Day Returns</strong>
                                    <p>Free and hassle-free</p>
                                </div>
                            </div>
                            <div className={styles.trustItem}>
                                <span className={styles.trustIcon}>✓</span>
                                <div>
                                    <strong>50-Point Inspection</strong>
                                    <p>Certified by technicians</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.specifications}>
                    <h2>Specifications</h2>
                    <div className={styles.specsGrid}>
                        {product.attributes.map((attr, index) => (
                            <div key={index} className={styles.specItem}>
                                <span className={styles.specLabel}>{attr.label}</span>
                                <span className={styles.specValue}>{attr.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
