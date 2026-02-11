'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ConditionBadge from '@/components/product/ConditionBadge'
import { useCart } from '@/contexts/CartContext'
import styles from './page.module.css'

interface Product {
    id: string
    title: string
    description: string
    price: number
    compare_at_price: number | null
    stock_quantity: number
    condition_grade: 'A' | 'B' | 'C'
    warranty_months: number
    sku: string
    images: { url: string; alt: string; is_primary: boolean }[]
    attributes: { label: string; value: string }[]
}

export default function ProductDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const { addItem } = useCart()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/products/${slug}`)

                if (!res.ok) {
                    if (res.status === 404) throw new Error('Product not found')
                    throw new Error('Failed to fetch product')
                }

                const data = await res.json()
                const p = data.product

                // Map API response to component state structure
                setProduct({
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    price: p.price,
                    compare_at_price: p.compare_price, // Field mapping
                    stock_quantity: p.stock,          // Field mapping
                    condition_grade: p.condition,     // Field mapping
                    warranty_months: 6, // Default or fetch if available
                    sku: p.sku || 'N/A',
                    images: p.images?.map((url: string, index: number) => ({
                        url,
                        alt: p.title,
                        is_primary: index === 0
                    })) || [],
                    attributes: p.attributes || []
                })
            } catch (err: any) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (slug) {
            fetchProduct()
        }
    }, [slug])

    const handleAddToCart = () => {
        if (!product) return
        addItem({
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.images[0]?.url || '/placeholder.png',
            variant: ''
        })
    }

    if (loading) {
        return (
            <div className={styles.page}>
                <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
                    Loading product details...
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className={styles.page}>
                <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
                    <h2>Product not found</h2>
                    <p>The product you are looking for does not exist or has been removed.</p>
                    <Button variant="primary" onClick={() => window.history.back()}>
                        Go Back
                    </Button>
                </div>
            </div>
        )
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
                    <a href="/products">Products</a>
                    <span>/</span>
                    <span>{product.title}</span>
                </div>

                <div className={styles.layout}>
                    <div className={styles.gallery}>
                        <div className={styles.mainImage}>
                            <div className={styles.imageWrapper}>
                                {product.images.length > 0 ? (
                                    <img
                                        src={product.images[selectedImage].url}
                                        alt={product.images[selectedImage].alt}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        <span className={styles.placeholderIcon}>📱</span>
                                        <p className={styles.placeholderText}>Product Image</p>
                                    </div>
                                )}
                            </div>
                            {discount > 0 && (
                                <div className={styles.discountBadge}>-{discount}% OFF</div>
                            )}
                        </div>

                        {product.images.length > 1 && (
                            <div className={styles.thumbnails}>
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailActive : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.details}>
                        <div className={styles.header}>
                            <div className={styles.badges}>
                                <Badge variant="success" size="md">
                                    Grade {product.condition_grade}
                                </Badge>
                                {product.sku !== 'N/A' && (
                                    <Badge variant="neutral" size="sm">
                                        SKU: {product.sku}
                                    </Badge>
                                )}
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
                                {product.compare_at_price && product.compare_at_price > product.price && (
                                    <span className={styles.comparePrice}>
                                        ₹{product.compare_at_price.toLocaleString('en-IN')}
                                    </span>
                                )}
                            </div>
                            {discount > 0 && product.compare_at_price && (
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
                                <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart}>
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

                {product.attributes.length > 0 && (
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
                )}
            </div>
        </div>
    )
}
