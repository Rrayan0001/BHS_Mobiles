'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ConditionBadge from '@/components/product/ConditionBadge'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { getMaxAllowedQuantity, resolvePurchaseMode } from '@/lib/cartRules'
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
    category?: {
        slug?: string
        name?: string
        display_name?: string
    } | null
    purchase_mode?: string | null
    is_single_unit?: boolean | null
}

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string
    const { addItem } = useCart()
    const { isAuthenticated } = useAuth()

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
                    attributes: p.attributes || [],
                    category: p.category || null,
                    purchase_mode: p.purchase_mode ?? null,
                    is_single_unit: p.is_single_unit ?? null,
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

    useEffect(() => {
        if (!product) return

        const purchaseMode = resolvePurchaseMode(product)
        const maxAllowedQuantity = getMaxAllowedQuantity(purchaseMode, product.stock_quantity)

        if (purchaseMode === 'single_unit') {
            setQuantity(1)
            return
        }

        if (maxAllowedQuantity > 0) {
            setQuantity((current) => Math.min(Math.max(1, current), maxAllowedQuantity))
        }
    }, [product])

    const handleAddToCart = () => {
        if (!product) return

        const purchaseMode = resolvePurchaseMode(product)
        const maxAllowedQuantity = getMaxAllowedQuantity(purchaseMode, product.stock_quantity)

        if (maxAllowedQuantity < 1) return

        const requestedQuantity =
            purchaseMode === 'single_unit'
                ? 1
                : Math.min(Math.max(1, quantity), maxAllowedQuantity)

        addItem({
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.images[0]?.url || '/placeholder.png',
            variant: '',
            quantity: requestedQuantity,
            purchaseMode,
            maxQuantity: maxAllowedQuantity
        })
    }

    const handleBuyNow = () => {
        if (!product || isOutOfStock) return

        handleAddToCart()

        if (isAuthenticated) {
            router.push('/checkout')
        } else {
            router.push('/auth/login?redirect=/checkout')
        }
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

    const purchaseMode = resolvePurchaseMode(product)
    const maxAllowedQuantity = getMaxAllowedQuantity(purchaseMode, product.stock_quantity)
    const isSingleUnit = purchaseMode === 'single_unit'
    const isOutOfStock = maxAllowedQuantity < 1

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
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        <span className={styles.placeholderIcon}>📱</span>
                                        <p className={styles.placeholderText}>Product Image</p>
                                    </div>
                                )}
                            </div>
                            {/* Discount Badge removed as per user request */}
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
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.details}>
                        <div className={styles.header}>
                            <div className={styles.badges}>
                                <Badge variant="neutral" size="md">
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
                            {isSingleUnit ? (
                                <div className={styles.quantitySelector}>
                                    <label>Quantity:</label>
                                    <div className={styles.quantityControls}>
                                        <input type="number" value={1} readOnly />
                                    </div>
                                </div>
                            ) : (
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
                                            onChange={(e) =>
                                                setQuantity(
                                                    Math.min(
                                                        maxAllowedQuantity,
                                                        Math.max(1, parseInt(e.target.value) || 1)
                                                    )
                                                )
                                            }
                                            min="1"
                                            max={maxAllowedQuantity}
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(maxAllowedQuantity, quantity + 1))}
                                            disabled={quantity >= maxAllowedQuantity}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className={styles.buttons}>
                                <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart} disabled={isOutOfStock}>
                                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                                <Button variant="secondary" size="lg" fullWidth onClick={handleBuyNow} disabled={isOutOfStock}>
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
