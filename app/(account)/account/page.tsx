'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import styles from './page.module.css'

// SVG Icons
const PackageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
)

const HeartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
)

const MapPinIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
)

interface OrderItem {
    id: string
    product_title: string
    price: number
    quantity: number
}

interface Order {
    id: string
    order_number: string
    status: string
    total: number
    created_at: string
    order_items: OrderItem[]
}

export default function AccountOverviewPage() {
    const { user } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
    const userEmail = user?.email || ''
    const userPhone = user?.user_metadata?.phone || 'Not provided'

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders')
                if (response.ok) {
                    const data = await response.json()
                    // When no order_number param, API returns array
                    const ordersList = Array.isArray(data.orders) ? data.orders : []
                    setOrders(ordersList)
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    const totalOrders = orders.length
    const recentOrders = orders.slice(0, 3)

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'delivered': return { background: '#dcfce7', color: '#166534' }
            case 'shipped': return { background: '#dbeafe', color: '#1e40af' }
            case 'pending': return { background: '#fef3c7', color: '#92400e' }
            case 'cancelled': return { background: '#fee2e2', color: '#991b1b' }
            default: return { background: '#f3f4f6', color: '#374151' }
        }
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Account Overview</h1>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}>
                        <PackageIcon />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Orders</span>
                        <span className={styles.statValue}>{loading ? '...' : totalOrders}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)' }}>
                        <HeartIcon />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Saved Items</span>
                        <span className={styles.statValue}>0</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' }}>
                        <MapPinIcon />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Addresses</span>
                        <span className={styles.statValue}>0</span>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Recent Orders</h2>
                    {totalOrders > 0 && (
                        <Link href="/account/orders" className={styles.viewAll}>
                            View All →
                        </Link>
                    )}
                </div>

                <div className={styles.ordersList}>
                    {loading ? (
                        <div className={styles.emptyState}>
                            <p style={{ color: '#6b7280' }}>Loading orders...</p>
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <PackageIcon />
                            <p>No orders yet</p>
                            <Link href="/products" className={styles.shopLink}>
                                Start Shopping →
                            </Link>
                        </div>
                    ) : (
                        recentOrders.map((order) => (
                            <div key={order.id} className={styles.orderCard} style={{
                                padding: '1rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '12px',
                                marginBottom: '0.75rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>#{order.order_number}</span>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textTransform: 'capitalize',
                                        ...getStatusStyle(order.status)
                                    }}>
                                        {order.status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                        {' · '}
                                        {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''}
                                    </span>
                                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                        ₹{order.total.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className={styles.section}>
                <h2>Account Details</h2>
                <div className={styles.detailsCard}>
                    <div className={styles.profileGrid}>
                        <div className={styles.profileItem}>
                            <label>NAME</label>
                            <p>{userName}</p>
                        </div>
                        <div className={styles.profileItem}>
                            <label>EMAIL</label>
                            <p>{userEmail}</p>
                        </div>
                        <div className={styles.profileItem}>
                            <label>PHONE</label>
                            <p>{userPhone}</p>
                        </div>
                    </div>
                    <div className={styles.profileActions}>
                        <Link href="/account/profile" className={styles.editBtn}>
                            Edit Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
