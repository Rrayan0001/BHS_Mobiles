'use client'

import React from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import styles from './page.module.css'

export default function MyOrdersPage() {
    const orders: any[] = [] // Empty for now

    if (orders.length === 0) {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>My Orders</h1>
                <div className={styles.emptyState}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                    <h3>No orders yet</h3>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                        You haven&apos;t placed any orders yet.
                    </p>
                    <Link href="/">
                        <Button variant="primary">Start Shopping</Button>
                    </Link>
                </div>
            </div>
        )
    }

    // ... kept original render logic for when orders exist (future use) ...
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'delivered': return 'success'
            case 'processing': return 'warning'
            case 'cancelled': return 'danger'
            default: return 'neutral'
        }
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>My Orders</h1>

            <div className={styles.ordersList}>
                {orders.map((order) => (
                    <Card key={order.id} padding="lg" className={styles.orderCard}>
                        <div className={styles.header}>
                            <div className={styles.headerInfo}>
                                <span className={styles.orderId}>{order.id}</span>
                                <span className={styles.orderDate}>{order.date}</span>
                            </div>
                            <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                        </div>

                        <div className={styles.items}>
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className={styles.item}>
                                    <div className={styles.itemImageFallback}>📱</div>
                                    <span className={styles.itemName}>{item.title}</span>
                                </div>
                            ))}
                            {order.items.length > 2 && (
                                <span className={styles.moreItems}>+{order.items.length - 2} more</span>
                            )}
                        </div>

                        <div className={styles.footer}>
                            <div className={styles.total}>
                                <span>Total Amount</span>
                                <strong>₹{order.total.toLocaleString()}</strong>
                            </div>
                            <div className={styles.actions}>
                                <Button variant="outline" size="sm">View Details</Button>
                                {order.status === 'delivered' && (
                                    <Button variant="primary" size="sm">Buy Again</Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
