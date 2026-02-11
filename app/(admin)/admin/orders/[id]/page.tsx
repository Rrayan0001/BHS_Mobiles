'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import styles from './page.module.css'

export default function OrderDetailPage() {
    const params = useParams()
    const id = params.id as string

    // Placeholder for when we connect to real API
    // const { order, loading } = useOrder(id)

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin/orders" className={styles.backLink}>
                        ← Back to Orders
                    </Link>
                    <div className={styles.titleWrapper}>
                        <h1 className={styles.title}>Order Details</h1>
                    </div>
                </div>
            </div>

            <Card padding="lg">
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2>Order Not Found</h2>
                    <p style={{ color: '#666', marginTop: '0.5rem' }}>
                        This order does not exist or has been removed.
                    </p>
                    <Link href="/admin/orders">
                        <button className={styles.actionBtn} style={{ marginTop: '1rem' }}>
                            View All Orders
                        </button>
                    </Link>
                </div>
            </Card>
        </div>
    )
}
