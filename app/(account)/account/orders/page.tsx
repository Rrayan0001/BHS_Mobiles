'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
    total: number
    payment_method: string
    payment_status: string
    created_at: string
    order_items: OrderItem[]
}

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [authRequired, setAuthRequired] = useState(false)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders')
                if (response.status === 401) {
                    setAuthRequired(true)
                    return
                }
                if (response.ok) {
                    const data = await response.json()
                    setOrders(data.orders || [])
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'delivered': return 'success'
            case 'shipped': return 'primary'
            case 'pending': return 'warning'
            case 'cancelled': return 'error'
            default: return 'neutral'
        }
    }

    if (loading) {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>My Orders</h1>
                <div className={styles.emptyState}>
                    <p style={{ color: '#6b7280' }}>Loading orders...</p>
                </div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>My Orders</h1>
                <div className={styles.emptyState}>
                    {authRequired ? (
                        <>
                            <h3>Login required</h3>
                            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                                Please sign in to view and track your orders.
                            </p>
                            <Link href="/auth/login">
                                <Button variant="primary">Go to Login</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                            <h3>No orders yet</h3>
                            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                                You haven&apos;t placed any orders yet.
                            </p>
                            <Link href="/products">
                                <Button variant="primary">Start Shopping</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>My Orders</h1>

            <div className={styles.ordersList}>
                {orders.map((order) => {
                    // Prefer a concrete product link so "Buy Again" lands on a shoppable product page.
                    const firstProductItem = order.order_items.find((item) => item.product_id)
                    const buyAgainHref = firstProductItem?.product_id
                        ? `/product/${firstProductItem.product_id}`
                        : '/products'

                    return (
                        <Card key={order.id} padding="lg" className={styles.orderCard}>
                            <div className={styles.header}>
                                <div className={styles.headerInfo}>
                                    <span className={styles.orderId}>{order.order_number}</span>
                                    <span className={styles.orderDate}>
                                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                            </div>

                            <div className={styles.items}>
                                {order.order_items.slice(0, 2).map((item) => (
                                    <div key={item.id} className={styles.item}>
                                        <div className={styles.itemImageFallback}>📱</div>
                                        <span className={styles.itemName}>
                                            {item.product_title} × {item.quantity}
                                        </span>
                                    </div>
                                ))}
                                {order.order_items.length > 2 && (
                                    <span className={styles.moreItems}>+{order.order_items.length - 2} more</span>
                                )}
                            </div>

                            <div className={styles.footer}>
                                <div className={styles.total}>
                                    <span>Total Amount</span>
                                    <strong>₹{order.total.toLocaleString()}</strong>
                                </div>
                                <div className={styles.actions}>
                                    <Link href={`/account/orders/${encodeURIComponent(order.order_number)}`}>
                                        <Button variant="outline" size="sm">View Details</Button>
                                    </Link>
                                    {(order.status === 'delivered' || order.status === 'shipped') && (
                                        <Link href={buyAgainHref}>
                                            <Button variant="primary" size="sm">Buy Again</Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
