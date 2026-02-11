'use client'

import React from 'react'
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

export default function AccountOverviewPage() {
    const { user } = useAuth()

    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
    const userEmail = user?.email || ''
    const userPhone = user?.user_metadata?.phone || 'Not provided'

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
                        <span className={styles.statValue}>0</span>
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
                    <Link href="/account/orders" className={styles.viewAll}>
                        View All →
                    </Link>
                </div>

                <div className={styles.ordersList}>
                    <div className={styles.emptyState}>
                        <PackageIcon />
                        <p>No orders yet</p>
                        <Link href="/products" className={styles.shopLink}>
                            Start Shopping →
                        </Link>
                    </div>
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

