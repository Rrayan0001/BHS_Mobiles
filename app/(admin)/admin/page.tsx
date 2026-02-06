'use client'

import React from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import styles from './page.module.css'

export default function AdminDashboard() {
    const stats = [
        {
            label: 'Total Sales',
            value: '₹1,24,599',
            trend: '+12%',
            trendLabel: 'from last month',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
            ),
            color: '#6366f1'
        },
        {
            label: 'Total Orders',
            value: '45',
            trend: '+5%',
            trendLabel: 'from last month',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            ),
            color: '#10b981'
        },
        {
            label: 'Pending Orders',
            value: '8',
            trend: '-2',
            trendLabel: 'from last week',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
            ),
            color: '#f59e0b'
        },
        {
            label: 'Low Stock Items',
            value: '12',
            trend: '+3',
            trendLabel: 'needs attention',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            ),
            color: '#ef4444'
        },
    ]

    const recentOrders = [
        { id: 'ORD-12345', customer: 'John Doe', total: 45999, status: 'pending', date: '2 mins ago' },
        { id: 'ORD-12344', customer: 'Jane Smith', total: 2499, status: 'shipped', date: '1 hour ago' },
        { id: 'ORD-12343', customer: 'Mike Johnson', total: 12499, status: 'delivered', date: '3 hours ago' },
        { id: 'ORD-12342', customer: 'Sarah Wilson', total: 899, status: 'cancelled', date: '5 hours ago' },
    ]

    const quickActions = [
        { label: 'Add Product', href: '/admin/products/new', icon: '📦', color: '#6366f1' },
        { label: 'Manage Banners', href: '/admin/banners', icon: '🖼️', color: '#8b5cf6' },
        { label: 'View Orders', href: '/admin/orders', icon: '🛍️', color: '#10b981' },
        { label: 'Moderate Reviews', href: '/admin/reviews', icon: '⭐', color: '#f59e0b' },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#f59e0b'
            case 'shipped': return '#3b82f6'
            case 'delivered': return '#10b981'
            case 'cancelled': return '#ef4444'
            default: return '#6b7280'
        }
    }

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.subtitle}>Welcome back, Admin! Here's what's happening today.</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.refreshBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <polyline points="1 20 1 14 7 14"></polyline>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <div key={index} className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className={styles.statContent}>
                            <div className={styles.statLabel}>{stat.label}</div>
                            <div className={styles.statValue}>{stat.value}</div>
                            <div className={styles.statFooter}>
                                <span className={`${styles.statTrend} ${stat.trend.startsWith('+') ? styles.trendUp : styles.trendDown}`}>
                                    {stat.trend.startsWith('+') ? '↑' : '↓'} {stat.trend}
                                </span>
                                <span className={styles.statTrendLabel}>{stat.trendLabel}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Quick Actions</h2>
                <div className={styles.quickActions}>
                    {quickActions.map((action, index) => (
                        <Link href={action.href} key={index} className={styles.quickAction}>
                            <div className={styles.actionIcon} style={{ backgroundColor: `${action.color}15` }}>
                                <span style={{ fontSize: '24px' }}>{action.icon}</span>
                            </div>
                            <span className={styles.actionLabel}>{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Recent Orders</h2>
                    <Link href="/admin/orders" className={styles.viewAllLink}>
                        View All
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </Link>
                </div>

                <Card padding="none" className={styles.tableCard}>
                    <div className={styles.tableWrapper}>
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
                                        <td>
                                            <span className={styles.orderId}>{order.id}</span>
                                        </td>
                                        <td>
                                            <span className={styles.customerName}>{order.customer}</span>
                                        </td>
                                        <td>
                                            <span className={styles.orderTotal}>₹{order.total.toLocaleString()}</span>
                                        </td>
                                        <td>
                                            <span
                                                className={styles.statusBadge}
                                                style={{
                                                    backgroundColor: `${getStatusColor(order.status)}15`,
                                                    color: getStatusColor(order.status)
                                                }}
                                            >
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.orderTime}>{order.date}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
