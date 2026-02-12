'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import styles from './page.module.css'

interface OrderItem {
    id: string
    product_id: string | null
    product_title: string
    product_sku: string | null
    price: number
    quantity: number
    subtotal: number
}

interface Order {
    id: string
    order_number: string
    status: string
    subtotal: number
    tax: number
    shipping: number
    total: number
    payment_method: string
    payment_status: string
    created_at: string
    order_items: OrderItem[]
}

export default function OrderDetailsPage() {
    const params = useParams<{ orderNumber: string }>()
    const orderNumber = decodeURIComponent(params.orderNumber)

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch(`/api/orders?order_number=${encodeURIComponent(orderNumber)}`)
                const data = await response.json()

                if (response.status === 401) {
                    setError('Please login to view this order.')
                    return
                }

                if (!response.ok) {
                    setError(data.error || 'Failed to load order details.')
                    return
                }

                const fetchedOrder = Array.isArray(data.orders) ? data.orders[0] : data.orders
                if (!fetchedOrder) {
                    setError('Order not found.')
                    return
                }

                setOrder(fetchedOrder)
            } catch (err) {
                setError('Failed to load order details.')
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [orderNumber])

    const statusVariant = (() => {
        if (!order) return 'neutral'
        switch (order.status) {
            case 'delivered':
                return 'success'
            case 'shipped':
                return 'primary'
            case 'pending':
                return 'warning'
            case 'cancelled':
                return 'error'
            default:
                return 'neutral'
        }
    })()

    if (loading) {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>Order Details</h1>
                <p className={styles.metaText}>Loading order details...</p>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>Order Details</h1>
                <Card padding="lg" className={styles.noticeCard}>
                    <p className={styles.errorText}>{error || 'Order not found.'}</p>
                    <div className={styles.noticeActions}>
                        {error?.toLowerCase().includes('login') && (
                            <Link href="/auth/login">
                                <Button variant="primary">Go to Login</Button>
                            </Link>
                        )}
                        <Link href="/account/orders">
                            <Button variant="outline">Back to Orders</Button>
                        </Link>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.headerRow}>
                <div>
                    <h1 className={styles.title}>Order {order.order_number}</h1>
                    <p className={styles.metaText}>
                        Placed on{' '}
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                </div>
                <Badge variant={statusVariant as any}>{order.status}</Badge>
            </div>

            <Card padding="lg" className={styles.detailsCard}>
                <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                        <span>Payment Method</span>
                        <strong>{order.payment_method.toUpperCase()}</strong>
                    </div>
                    <div className={styles.summaryItem}>
                        <span>Payment Status</span>
                        <strong>{order.payment_status}</strong>
                    </div>
                    <div className={styles.summaryItem}>
                        <span>Total Items</span>
                        <strong>{order.order_items.reduce((count, item) => count + item.quantity, 0)}</strong>
                    </div>
                    <div className={styles.summaryItem}>
                        <span>Order Total</span>
                        <strong>₹{order.total.toLocaleString()}</strong>
                    </div>
                </div>
            </Card>

            <Card padding="lg" className={styles.detailsCard}>
                <h2 className={styles.sectionTitle}>Items in this order</h2>
                <div className={styles.itemList}>
                    {order.order_items.map((item) => (
                        <div key={item.id} className={styles.itemRow}>
                            <div>
                                <p className={styles.itemName}>{item.product_title}</p>
                                {item.product_sku && <p className={styles.itemMeta}>SKU: {item.product_sku}</p>}
                            </div>
                            <div className={styles.itemValues}>
                                <span>Qty {item.quantity}</span>
                                <strong>₹{item.subtotal.toLocaleString()}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card padding="lg" className={styles.detailsCard}>
                <h2 className={styles.sectionTitle}>Amount Breakdown</h2>
                <div className={styles.billRow}>
                    <span>Subtotal</span>
                    <strong>₹{order.subtotal.toLocaleString()}</strong>
                </div>
                <div className={styles.billRow}>
                    <span>Tax</span>
                    <strong>₹{order.tax.toLocaleString()}</strong>
                </div>
                <div className={styles.billRow}>
                    <span>Shipping</span>
                    <strong>₹{order.shipping.toLocaleString()}</strong>
                </div>
                <div className={`${styles.billRow} ${styles.billTotal}`}>
                    <span>Total</span>
                    <strong>₹{order.total.toLocaleString()}</strong>
                </div>
            </Card>

            <div className={styles.actions}>
                <Link href="/account/orders">
                    <Button variant="outline">Back to Orders</Button>
                </Link>
                <Link href="/products">
                    <Button variant="primary">Continue Shopping</Button>
                </Link>
            </div>
        </div>
    )
}
