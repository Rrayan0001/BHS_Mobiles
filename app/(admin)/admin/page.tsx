'use client'

import React from 'react'
import Card from '@/components/ui/Card'
import styles from './page.module.css'

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Sales', value: '₹1,24,599', trend: '+12%', color: 'blue' },
        { label: 'Total Orders', value: '45', trend: '+5%', color: 'green' },
        { label: 'Pending Orders', value: '8', trend: '-2', color: 'orange' },
        { label: 'Low Stock Items', value: '12', trend: '+3', color: 'red' },
    ]

    const recentOrders = [
        { id: 'ORD-12345', customer: 'John Doe', total: '₹45,999', status: 'pending', date: '2 mins ago' },
        { id: 'ORD-12344', customer: 'Jane Smith', total: '₹2,499', status: 'shipped', date: '1 hour ago' },
        { id: 'ORD-12343', customer: 'Mike Johnson', total: '₹12,499', status: 'delivered', date: '3 hours ago' },
        { id: 'ORD-12342', customer: 'Sarah Wilson', total: '₹899', status: 'cancelled', date: '5 hours ago' },
    ]

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>Welcome back, Admin</p>
            </div>

            <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <Card key={index} padding="md" className={styles.statCard}>
                        <div className={styles.statLabel}>{stat.label}</div>
                        <div className={styles.statValue}>{stat.value}</div>
                        <div className={`${styles.statTrend} ${stat.trend.startsWith('+') ? styles.trendUp : styles.trendDown}`}>
                            {stat.trend} from last month
                        </div>
                    </Card>
                ))}
            </div>

            <div className={styles.grid}>
                <Card padding="lg" className={styles.recentOrders}>
                    <div className={styles.cardHeader}>
                        <h2>Recent Orders</h2>
                        <button className={styles.viewAll}>View All</button>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.total}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className={styles.date}>{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <Card padding="lg" className={styles.quickActions}>
                    <div className={styles.cardHeader}>
                        <h2>Quick Actions</h2>
                    </div>
                    <div className={styles.actionsList}>
                        <button className={styles.actionButton}>
                            <span className={styles.actionIcon}>➕</span>
                            Add New Product
                        </button>
                        <button className={styles.actionButton}>
                            <span className={styles.actionIcon}>📦</span>
                            Manage Inventory
                        </button>
                        <button className={styles.actionButton}>
                            <span className={styles.actionIcon}>💬</span>
                            View Inquiries
                        </button>
                        <button className={styles.actionButton}>
                            <span className={styles.actionIcon}>⚙️</span>
                            Site Settings
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
