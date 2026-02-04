'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import styles from './page.module.css'

// Mock product data - This would come from Supabase in production
const mockProducts: { [key: string]: typeof sampleProduct } = {
    'tp1': {
        id: 'tp1',
        name: 'Samsung S24 Ultra',
        category: 'Android',
        brand: 'Samsung',
        price: 68999,
        mrp: 103499,
        discount: '34% OFF',
        rating: 4.5,
        ratingCount: 28,
        images: ['📱'],
        variants: [
            { id: 'v1', name: '256GB', price: 68999 },
            { id: 'v2', name: '512GB', price: 78999 },
        ],
        description: [
            'Comes with Bill & UPTO 1 YEAR Warranty',
            'Colors: Black, Grey, Violet',
            'This device is 100% Original & Brand New',
            '5G Connectivity',
            'What Comes along: Phone + Charger + Box',
        ],
        specifications: {
            'Display': '6.8" Dynamic AMOLED 2X',
            'Processor': 'Snapdragon 8 Gen 3',
            'Camera': '200MP + 12MP + 10MP + 50MP',
            'Battery': '5000mAh',
            'Storage': '256GB / 512GB',
        },
        delivery: {
            dispatchDays: '1-2 Days',
            expectedBy: '7-10 Days',
            shipping: 'FREE',
        },
    },
    'tp3': {
        id: 'tp3',
        name: 'iPhone 17',
        category: 'iPhone',
        brand: 'Apple',
        price: 74999,
        mrp: 104999,
        discount: '29% OFF',
        rating: 4.8,
        ratingCount: 45,
        images: ['📱'],
        variants: [
            { id: 'v1', name: '256GB', price: 74999 },
            { id: 'v2', name: '512GB', price: 89999 },
        ],
        description: [
            'Comes with Bill & UPTO 1 YEAR APPLE Warranty',
            'Colors: Black, White, Blue',
            'This device is 100% Original & Brand New',
            '5G Connectivity',
            'What Comes along: Phone + Cable + Box',
        ],
        specifications: {
            'Display': '6.7" Super Retina XDR',
            'Processor': 'A19 Bionic',
            'Camera': '48MP + 12MP + 12MP',
            'Battery': '4500mAh',
            'Storage': '256GB / 512GB / 1TB',
        },
        delivery: {
            dispatchDays: '1-2 Days',
            expectedBy: '7-10 Days',
            shipping: 'FREE',
        },
    },
    'tp4': {
        id: 'tp4',
        name: 'Watch Series Ultra 3 (BLACK EDITION)',
        category: 'iWatch',
        brand: 'Apple',
        price: 56999,
        mrp: 79799,
        discount: '29% OFF',
        rating: 4.5,
        ratingCount: 12,
        images: ['⌚'],
        variants: [
            { id: 'v1', name: '49MM', price: 56999 },
        ],
        description: [
            'Comes with Bill & UPTO 1 YEAR APPLE Warranty',
            'Colors: BLACK',
            'This device is 100% Original & Brand New',
            'GPS + Cellular',
            'What Comes along: Watch & Strap',
            'You can order other accessories Click Here',
        ],
        specifications: {
            'Display': '49mm Always-On Retina LTPO OLED',
            'Processor': 'S9 SiP',
            'Water Resistance': '100m',
            'Battery': '36 hours',
            'Connectivity': 'GPS + Cellular',
        },
        delivery: {
            dispatchDays: '1-2 Days',
            expectedBy: '07 Feb - 13 Feb',
            shipping: 'FREE',
        },
    },
}

const sampleProduct = mockProducts['tp4']

export default function ProductDetailPage() {
    const params = useParams()
    const productId = params.id as string
    const { addItem } = useCart()

    // Get product from mock data or use default
    const product = mockProducts[productId] || mockProducts['tp4']

    const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
    const [quantity, setQuantity] = useState(1)
    const [activeAccordion, setActiveAccordion] = useState<string | null>('delivery')

    const handleAddToCart = () => {
        addItem({
            id: `${product.id}-${selectedVariant.id}`,
            name: product.name,
            price: selectedVariant.price,
            image: product.images[0],
            variant: selectedVariant.name
        })
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
                    <Link href="/products">All</Link>
                    <span>/</span>
                    <span className={styles.current}>{product.name}</span>
                </div>

                <div className={styles.productLayout}>
                    {/* Left: Product Image */}
                    <div className={styles.imageSection}>
                        <div className={styles.mainImage}>
                            <span style={{ fontSize: '8rem' }}>{product.images[0]}</span>
                        </div>
                        <div className={styles.thumbnails}>
                            {product.images.map((img, idx) => (
                                <div key={idx} className={styles.thumbnail}>
                                    <span style={{ fontSize: '2rem' }}>{img}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className={styles.detailsSection}>
                        <div className={styles.categoryBrand}>
                            <span>{product.category}</span>
                            <span className={styles.dot}>•</span>
                            <span>{product.brand}</span>
                        </div>

                        <h1 className={styles.productTitle}>{product.name}</h1>

                        <div className={styles.ratingRow}>
                            <span className={styles.rating}>
                                {product.rating} ★
                            </span>
                            <span className={styles.ratingCount}>{product.ratingCount} Ratings</span>
                        </div>

                        <div className={styles.priceRow}>
                            <span className={styles.price}>₹{selectedVariant.price.toLocaleString()}</span>
                            <span className={styles.mrp}>MRP <s>₹{product.mrp.toLocaleString()}</s></span>
                            <span className={styles.discount}>({product.discount})</span>
                        </div>

                        {/* Variant Selector */}
                        <div className={styles.variantSection}>
                            <div className={styles.sectionLabel}>
                                <span className={styles.labelIcon}>⚙️</span>
                                SELECT MODEL
                            </div>
                            <div className={styles.variants}>
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        className={`${styles.variantBtn} ${selectedVariant.id === variant.id ? styles.selected : ''}`}
                                        onClick={() => setSelectedVariant(variant)}
                                    >
                                        <div className={styles.variantName}>{variant.name}</div>
                                        <div className={styles.variantPrice}>₹{variant.price.toLocaleString()}</div>
                                        {selectedVariant.id === variant.id && (
                                            <span className={styles.checkmark}>✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

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
                                    onClick={() => setQuantity(quantity + 1)}
                                    className={styles.qtyBtn}
                                >
                                    +
                                </button>
                            </div>
                            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                                <span className={styles.cartIcon}>🛒</span>
                                Add to Cart - Rs. {(selectedVariant.price * quantity).toLocaleString()}
                            </button>
                        </div>

                        <button className={styles.wishlistBtn}>
                            <span>♡</span> Add to Wishlist
                        </button>

                        {/* Accordions */}
                        <div className={styles.accordions}>
                            {/* Estimated Delivery */}
                            <div className={styles.accordion}>
                                <button
                                    className={styles.accordionHeader}
                                    onClick={() => toggleAccordion('delivery')}
                                >
                                    <span className={styles.accordionIcon}>📦</span>
                                    ESTIMATED DELIVERY
                                    <span className={styles.toggleIcon}>
                                        {activeAccordion === 'delivery' ? '−' : '+'}
                                    </span>
                                </button>
                                {activeAccordion === 'delivery' && (
                                    <div className={styles.accordionContent}>
                                        <div className={styles.deliveryRow}>
                                            <span>Expected by</span>
                                            <span className={styles.deliveryValue}>{product.delivery.expectedBy}</span>
                                        </div>
                                        <div className={styles.deliveryRow}>
                                            <span>Shipping</span>
                                            <span className={styles.freeShipping}>{product.delivery.shipping}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
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
                                        <ul className={styles.detailsList}>
                                            {product.description.map((item, idx) => (
                                                <li key={idx}>• {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Specifications */}
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
                                            {Object.entries(product.specifications).map(([key, value]) => (
                                                <div key={key} className={styles.specRow}>
                                                    <span className={styles.specLabel}>{key}</span>
                                                    <span className={styles.specValue}>{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

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
                                            <p><strong>Dispatch:</strong> Dispatch to Courier in {product.delivery.dispatchDays}</p>
                                            <p><strong>Returns:</strong> 7-day return policy for unused items</p>
                                            <p><strong>Warranty:</strong> 1 Year manufacturer warranty</p>
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
