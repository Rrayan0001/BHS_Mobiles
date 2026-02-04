'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

// SVG Icons
const CartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="80" height="80">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
)

const TruckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
)

const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
)

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
)

const LockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
)

const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <polyline points="23 4 23 10 17 10"></polyline>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
    </svg>
)

export default function CartPage() {
    const [cartItems, setCartItems] = useState<any[]>([])

    const updateQuantity = (itemId: string, newQuantity: number) => {
        setCartItems((items) =>
            items.map((item) =>
                item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
            )
        )
    }

    const removeItem = (itemId: string) => {
        setCartItems((items) => items.filter((item) => item.id !== itemId))
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal > 0 ? (subtotal >= 50000 ? 0 : 200) : 0
    const total = subtotal + shipping

    if (cartItems.length === 0) {
        return (
            <div className={styles.page}>
                <div className="container">
                    <div className={styles.emptyCart}>
                        <div className={styles.emptyIcon}>
                            <CartIcon />
                        </div>
                        <h1>Your cart is empty</h1>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link href="/products" className={styles.shopBtn}>
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className="container">
                <h1 className={styles.title}>Shopping Cart</h1>

                <div className={styles.layout}>
                    <div className={styles.items}>
                        {cartItems.map((item) => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.itemImage}>
                                    <div className={styles.imagePlaceholder}>
                                        <span>📱</span>
                                    </div>
                                </div>

                                <div className={styles.itemDetails}>
                                    <div className={styles.itemHeader}>
                                        <Link href={`/product/${item.id}`} className={styles.itemTitle}>
                                            {item.title}
                                        </Link>
                                        <span className={styles.gradeBadge}>
                                            Grade {item.condition_grade}
                                        </span>
                                    </div>

                                    <p className={styles.itemMeta}>
                                        SKU: {item.sku} • {item.warranty_months} months warranty
                                    </p>

                                    <div className={styles.itemFooter}>
                                        <div className={styles.quantityControl}>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateQuantity(item.id, parseInt(e.target.value) || 1)
                                                }
                                                min="1"
                                            />
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className={styles.removeButton}
                                            onClick={() => removeItem(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.itemPrice}>
                                    <span className={styles.price}>
                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                    </span>
                                    {item.quantity > 1 && (
                                        <span className={styles.unitPrice}>
                                            ₹{item.price.toLocaleString('en-IN')} each
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.summary}>
                        <h2 className={styles.summaryTitle}>Order Summary</h2>

                        <div className={styles.summaryRow}>
                            <span>Subtotal ({cartItems.length} items)</span>
                            <span>₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>

                        <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                        </div>

                        {shipping > 0 && subtotal < 50000 && (
                            <div className={styles.freeShippingBanner}>
                                Add ₹{(50000 - subtotal).toLocaleString('en-IN')} more for FREE shipping!
                            </div>
                        )}

                        <div className={styles.summaryDivider} />

                        <div className={styles.summaryTotal}>
                            <span>Total</span>
                            <span>₹{total.toLocaleString('en-IN')}</span>
                        </div>

                        <button className={styles.checkoutBtn}>
                            Proceed to Checkout
                        </button>

                        <div className={styles.trustBadges}>
                            <div className={styles.trustBadge}>
                                <LockIcon />
                                <span>Secure Checkout</span>
                            </div>
                            <div className={styles.trustBadge}>
                                <RefreshIcon />
                                <span>14-Day Returns</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.benefits}>
                    <div className={styles.benefit}>
                        <div className={styles.benefitIcon}>
                            <TruckIcon />
                        </div>
                        <div>
                            <strong>Free Shipping</strong>
                            <p>On orders above ₹50,000</p>
                        </div>
                    </div>
                    <div className={styles.benefit}>
                        <div className={styles.benefitIcon}>
                            <ShieldIcon />
                        </div>
                        <div>
                            <strong>Warranty Included</strong>
                            <p>Up to 6 months coverage</p>
                        </div>
                    </div>
                    <div className={styles.benefit}>
                        <div className={styles.benefitIcon}>
                            <CheckIcon />
                        </div>
                        <div>
                            <strong>Certified Quality</strong>
                            <p>50-point inspection</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
