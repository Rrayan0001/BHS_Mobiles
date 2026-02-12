'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import styles from './page.module.css'

interface Order {
    id: string
    order_number: string
    customer: string
    date: string
    items: number
    total: number
    payment: string
    payment_status: string
    status: string
}

export default function AdminOrdersPage() {
    const [activeFilter, setActiveFilter] = useState('all')
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/admin/orders')
            const data = await response.json()
            setOrders(data.orders || [])
        } catch (error) {
            console.error('Failed to fetch orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredOrders = activeFilter === 'all'
        ? orders
        : orders.filter((order) => order.status === activeFilter)

    const orderFilters = [
        { label: 'All', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
    ]

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Orders</h1>
                <div className={styles.filters}>
                    {orderFilters.map((filter) => (
                        <button
                            key={filter.value}
                            type="button"
                            className={`${styles.filterBtn} ${activeFilter === filter.value ? styles.active : ''}`}
                            onClick={() => setActiveFilter(filter.value)}
                        >
                            {filter.label}
                        </button>
                    ))}
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
                        {loading ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                                    Loading orders...
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <span className={styles.orderId}>{order.order_number}</span>
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
                                                        order.status === 'pending' ? 'warning' : 'error'
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
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}
