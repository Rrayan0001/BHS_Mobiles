'use client'

import React from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import styles from './page.module.css'

export default function AdminOrdersPage() {
    const orders = [
        {
            id: 'ORD-12345',
            customer: 'John Doe',
            date: 'Oct 24, 2023 at 10:30 AM',
            total: 45999,
            status: 'pending',
            items: 1,
            payment: 'cod'
        },
        {
            id: 'ORD-12344',
            customer: 'Jane Smith',
            date: 'Oct 23, 2023 at 2:15 PM',
            total: 2499,
            status: 'shipped',
            items: 2,
            payment: 'online'
        },
        {
            id: 'ORD-12343',
            customer: 'Mike Johnson',
            date: 'Oct 23, 2023 at 9:00 AM',
            total: 12499,
            status: 'delivered',
            items: 1,
            payment: 'online'
        }
    ]

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Orders</h1>
                <div className={styles.filters}>
                    <button className={`${styles.filterBtn} ${styles.active}`}>All</button>
                    <button className={styles.filterBtn}>Pending</button>
                    <button className={styles.filterBtn}>Shipped</button>
                    <button className={styles.filterBtn}>Delivered</button>
                    <button className={styles.filterBtn}>Cancelled</button>
                </div>
            </div>

            <Card padding="none" className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>
                                    <span className={styles.orderId}>{order.id}</span>
                                </td>
                                <td>
                                    <div className={styles.customerName}>{order.customer}</div>
                                </td>
                                <td className={styles.date}>{order.date}</td>
                                <td>{order.items} items</td>
                                <td className={styles.total}>₹{order.total.toLocaleString()}</td>
                                <td>
                                    <Badge variant="neutral" size="sm">
                                        {order.payment.toUpperCase()}
                                    </Badge>
                                </td>
                                <td>
                                    <Badge
                                        variant={
                                            order.status === 'delivered' ? 'success' :
                                                order.status === 'shipped' ? 'primary' :
                                                    order.status === 'pending' ? 'warning' : 'danger'
                                        }
                                        size="sm"
                                    >
                                        {order.status}
                                    </Badge>
                                </td>
                                <td>
                                    <Link href={`/admin/orders/${order.id}`}>
                                        <button className={styles.actionBtn}>View</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}
