'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import styles from './page.module.css'

interface ProductData {
    id: string
    title: string
    slug: string
    description: string
    price: number
    compare_price: number | null
    stock: number
    condition: string
    images: string[]
    sku: string
    category: {
        name: string
        display_name: string
        slug: string
    } | null
    attributes: { label: string; value: string }[]
}

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const productId = params.id as string
    const { addItem } = useCart()
    const { isAuthenticated } = useAuth()

    const [product, setProduct] = useState<ProductData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [activeAccordion, setActiveAccordion] = useState<string | null>('delivery')

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/products/${productId}`)

                if (!res.ok) {
                    if (res.status === 404) throw new Error('Product not found')
                    throw new Error('Failed to fetch product')
                }

                const data = await res.json()
                const p = data.product

                setProduct({
                    id: p.id,
                    title: p.title,
                    slug: p.slug,
                    description: p.description || '',
                    price: p.price,
                    compare_price: p.compare_price,
                    stock: p.stock,
                    condition: p.condition,
                    images: p.images || [],
                    sku: p.sku || 'N/A',
                    category: p.category,
                    attributes: p.attributes || []
                })
            } catch (err: any) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (productId) {
            fetchProduct()
        }
    }, [productId])

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
                    <Link href="/products" style={{ color: 'var(--color-neutral-900)', fontWeight: 600, textDecoration: 'underline' }}>
                        Browse All Products
                    </Link>
                </div>
            </div>
        )
    }

    const discount = product.compare_price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.images?.[0] || '📱',
            variant: ''
        })
    }

    const handleOrderNow = () => {
        addItem({
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.images?.[0] || '📱',
            variant: ''
        })

        if (isAuthenticated) {
            router.push('/checkout')
        } else {
            router.push('/auth/login?redirect=/checkout')
        }
    }

    const toggleAccordion = (section: string) => {
        setActiveAccordion(activeAccordion === section ? null : section)
    }

    return (
        <div className={styles.page}>
            <div className="container">
                {/* Breadcrumbs */}
                <div className={styles.breadcrumbs}>
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <Link href="/products">All Products</Link>
                    <span>/</span>
                    <span className={styles.current}>{product.title}</span>
                </div>

                <div className={styles.productLayout}>
                    {/* Left: Product Image */}
                    <div className={styles.imageSection}>
                        <div className={styles.mainImage}>
                            {product.images.length > 0 ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                                />
                            ) : (
                                <span style={{ fontSize: '8rem' }}>📱</span>
                            )}
                        </div>
                        {product.images.length > 1 && (
                            <div className={styles.thumbnails}>
                                {product.images.map((img, idx) => (
                                    <div key={idx} className={styles.thumbnail}>
                                        <img
                                            src={img}
                                            alt={`${product.title} ${idx + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Details */}
                    <div className={styles.detailsSection}>
                        {product.category && (
                            <div className={styles.categoryBrand}>
                                <span>{product.category.display_name || product.category.name}</span>
                            </div>
                        )}

                        <h1 className={styles.productTitle}>{product.title}</h1>

                        <div className={styles.priceRow}>
                            <span className={styles.price}>₹{product.price.toLocaleString()}</span>
                            {product.compare_price && product.compare_price > product.price && (
                                <>
                                    <span className={styles.mrp}>MRP <s>₹{product.compare_price.toLocaleString()}</s></span>
                                    <span className={styles.discount}>({discount}% OFF)</span>
                                </>
                            )}
                        </div>

                        {product.stock > 0 && product.stock <= 5 && (
                            <p style={{ color: '#ef4444', fontWeight: 500, fontSize: '0.9rem', margin: '0.5rem 0' }}>
                                Only {product.stock} left in stock!
                            </p>
                        )}

                        {/* Quantity & Add to Cart */}
                        <div className={styles.actionRow}>
                            <div className={styles.quantitySelector}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className={styles.qtyBtn}
                                >
                                    −
                                </button>
                                <span className={styles.qtyValue}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className={styles.qtyBtn}
                                >
                                    +
                                </button>
                            </div>
                            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                                <span className={styles.cartIcon}>🛒</span>
                                Add to Cart
                            </button>
                        </div>

                        {/* Order Now Button */}
                        <button className={styles.orderNowBtn} onClick={handleOrderNow}>
                            ⚡ Order Now - ₹{(product.price * quantity).toLocaleString()}
                        </button>

                        <button className={styles.wishlistBtn}>
                            <span>♡</span> Add to Wishlist
                        </button>

                        {/* Accordions */}
                        <div className={styles.accordions}>
                            {/* Product Details */}
                            {product.description && (
                                <div className={styles.accordion}>
                                    <button
                                        className={styles.accordionHeader}
                                        onClick={() => toggleAccordion('details')}
                                    >
                                        <span className={styles.accordionIcon}>📋</span>
                                        PRODUCT DETAILS
                                        <span className={styles.toggleIcon}>
                                            {activeAccordion === 'details' ? '−' : '+'}
                                        </span>
                                    </button>
                                    {activeAccordion === 'details' && (
                                        <div className={styles.accordionContent}>
                                            <p>{product.description}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Specifications */}
                            {product.attributes.length > 0 && (
                                <div className={styles.accordion}>
                                    <button
                                        className={styles.accordionHeader}
                                        onClick={() => toggleAccordion('specs')}
                                    >
                                        <span className={styles.accordionIcon}>ℹ️</span>
                                        SPECIFICATIONS
                                        <span className={styles.toggleIcon}>
                                            {activeAccordion === 'specs' ? '−' : '+'}
                                        </span>
                                    </button>
                                    {activeAccordion === 'specs' && (
                                        <div className={styles.accordionContent}>
                                            <div className={styles.specsGrid}>
                                                {product.attributes.map((attr, idx) => (
                                                    <div key={idx} className={styles.specRow}>
                                                        <span className={styles.specLabel}>{attr.label}</span>
                                                        <span className={styles.specValue}>{attr.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Delivery & Returns */}
                            <div className={styles.accordion}>
                                <button
                                    className={styles.accordionHeader}
                                    onClick={() => toggleAccordion('returns')}
                                >
                                    <span className={styles.accordionIcon}>🚚</span>
                                    DELIVERY & RETURNS
                                    <span className={styles.toggleIcon}>
                                        {activeAccordion === 'returns' ? '−' : '+'}
                                    </span>
                                </button>
                                {activeAccordion === 'returns' && (
                                    <div className={styles.accordionContent}>
                                        <div className={styles.deliveryInfo}>
                                            <p><strong>Dispatch:</strong> 1-2 business days</p>
                                            <p><strong>Expected Delivery:</strong> 5-7 business days</p>
                                            <p><strong>Returns:</strong> 7-day return policy for unused items</p>
                                            <p><strong>Shipping:</strong> FREE for orders above ₹50,000</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
