'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from './page.module.css'
import { useCart } from '@/contexts/CartContext'

function OrderSuccessContent() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams.get('order')
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [confetti, setConfetti] = useState(true)
    const { clearCart, setIsOpen } = useCart()

    useEffect(() => {
        // Clear cart and ensure popup is closed
        clearCart()
        setIsOpen(false)

        // Hide confetti after animation
        const timer = setTimeout(() => setConfetti(false), 3000)

        // Fetch order details
        if (orderNumber) {
            fetch(`/api/orders?order_number=${orderNumber}`)
                .then(res => res.json())
                .then(data => {
                    if (data.orders) {
                        setOrder(data.orders)
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }

        return () => clearTimeout(timer)
    }, [orderNumber])

    if (loading) {
        return (
            <div className={styles.page}>
                <div className="container">
                    <div className={styles.content}>
                        <div className={styles.successIcon}>⏳</div>
                        <h1 className={styles.title}>Loading Order Details...</h1>
                    </div>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className={styles.page}>
                <div className="container">
                    <div className={styles.content}>
                        <div className={styles.successIcon} style={{ background: 'var(--color-error)' }}>✕</div>
                        <h1 className={styles.title}>Order Not Found</h1>
                        <p className={styles.subtitle}>We couldn't find the order details. Please check your orders page.</p>
                        <Link href="/account/orders">
                            <Button variant="primary">My Orders</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            {confetti && <div className={styles.confetti}>🎉</div>}

            <div className="container">
                <div className={styles.content}>
                    <div className={styles.successIcon}>✓</div>

                    <h1 className={styles.title}>Order Placed Successfully!</h1>
                    <p className={styles.subtitle}>
                        Thank you for your purchase. Your order has been confirmed.
                    </p>

                    <Card padding="lg" className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                            <span className={styles.orderId}>Order #{order.order_number}</span>
                            <span className={styles.orderDate}>
                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'short', year: 'numeric'
                                })}
                            </span>
                        </div>

                        {order.order_items && order.order_items.length > 0 ? (
                            <div className={styles.itemsList}>
                                {order.order_items.map((item: any, index: number) => (
                                    <div key={item.id || index} className={styles.item}>
                                        <div className={styles.itemImage}>
                                            📱
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemHeader}>
                                                <span className={styles.itemName}>{item.product_title}</span>
                                                <span className={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                            <div className={styles.itemMeta}>
                                                {item.product_sku && <span>SKU: {item.product_sku} · </span>}
                                                Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '1rem', color: '#6b7280', textAlign: 'center' }}>
                                Order placed successfully. Item details are being processed.
                            </div>
                        )}

                        <div className={styles.summary}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₹{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Shipping</span>
                                <span>₹{order.shipping.toLocaleString()}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Tax</span>
                                <span>₹{order.tax.toLocaleString()}</span>
                            </div>
                            <div className={styles.summaryTotal}>
                                <span>Total Paid</span>
                                <span>₹{order.total.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className={styles.shippingInfo}>
                            <h3>Shipping Address</h3>
                            <p>
                                {order.shipping_address.fullName}<br />
                                {order.shipping_address.phone}<br />
                                {order.shipping_address.address}<br />
                                {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                            </p>
                        </div>
                    </Card>

                    <div className={styles.actions}>
                        <Link href="/account/orders">
                            <Button variant="primary" size="lg">Track Order</Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" size="lg">Continue Shopping</Button>
                        </Link>
                    </div>

                    <div className={styles.contactSection}>
                        <p>Need help with your order?</p>
                        <Link href="/contact">
                            <Button variant="outline" className={styles.contactBtn}>
                                📞 Contact Support
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LoadingFallback() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.successIcon}>⏳</div>
                    <h1 className={styles.title}>Loading...</h1>
                </div>
            </div>
        </div>
    )
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <OrderSuccessContent />
        </Suspense>
    )
}
