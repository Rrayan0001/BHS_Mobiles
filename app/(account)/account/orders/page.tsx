'use client'

import React from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import styles from './page.module.css'

export default function MyOrdersPage() {
    const orders = [
        {
            id: 'ORD-12345',
            date: 'Oct 24, 2023',
            total: 45999,
            status: 'delivered',
            items: [
                { title: 'iPhone 13 Pro', image: '/placeholder.jpg' }
            ]
        },
        {
            id: 'ORD-12346',
            date: 'Sep 15, 2023',
            total: 2499,
            status: 'delivered',
            items: [
                { title: 'AirPods Pro Case', image: '/placeholder.jpg' },
                { title: 'USB-C Cable', image: '/placeholder.jpg' }
            ]
        },
        {
            id: 'ORD-12347',
            date: 'Aug 05, 2023',
            total: 12999,
            status: 'processing',
            items: [
                { title: 'Galaxy Watch 4', image: '/placeholder.jpg' }
            ]
        }
    ]

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
                            {order.items.map((item, idx) => (
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
