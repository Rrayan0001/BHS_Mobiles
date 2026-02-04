'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import styles from './page.module.css'

export default function OrderDetailPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [status, setStatus] = useState('processing')
    const [loading, setLoading] = useState(false)

    // Mock data
    const order = {
        id,
        date: 'Oct 24, 2023 at 10:30 AM',
        payment_method: 'Credit Card',
        payment_status: 'paid',
        customer: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+91 98765 43210'
        },
        shipping_address: {
            line1: '123 Main St',
            line2: 'Apt 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
        },
        items: [
            { id: 1, name: 'iPhone 13 Pro', price: 45999, quantity: 1, sku: 'IP13P-128-SB' },
            { id: 2, name: 'Screen Protector', price: 999, quantity: 1, sku: 'ACC-SP-IP13' }
        ],
        summary: {
            subtotal: 46998,
            shipping: 0,
            tax: 8460,
            total: 55458
        }
    }

    const handleUpdateStatus = async (newStatus: string) => {
        setStatus(newStatus)
        // TODO: Update in Supabase
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin/orders" className={styles.backLink}>
                        ← Back to Orders
                    </Link>
                    <div className={styles.titleWrapper}>
                        <h1 className={styles.title}>Order #{order.id}</h1>
                        <Badge variant="warning">{status}</Badge>
                    </div>
                    <p className={styles.subtitle}>Placed on {order.date}</p>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="outline">Print Invoice</Button>
                    <Button variant="primary">Send Email</Button>
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.mainColumn}>
                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.sectionTitle}>Order Items</h2>
                        <table className={styles.itemsTable}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className={styles.itemName}>{item.name}</div>
                                        </td>
                                        <td>{item.sku}</td>
                                        <td>{item.quantity}</td>
                                        <td>₹{item.price.toLocaleString()}</td>
                                        <td className={styles.itemTotal}>
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={styles.summary}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₹{order.summary.subtotal.toLocaleString()}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Shipping</span>
                                <span>{order.summary.shipping === 0 ? 'Free' : `₹${order.summary.shipping}`}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Tax (18%)</span>
                                <span>₹{order.summary.tax.toLocaleString()}</span>
                            </div>
                            <div className={styles.summaryTotal}>
                                <span>Total</span>
                                <span>₹{order.summary.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>

                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.sectionTitle}>Timeline</h2>
                        <div className={styles.timeline}>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineIcon}>✅</div>
                                <div className={styles.timelineContent}>
                                    <strong>Order Placed</strong>
                                    <p>Oct 24, 2023 at 10:30 AM</p>
                                </div>
                            </div>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineIcon}>💳</div>
                                <div className={styles.timelineContent}>
                                    <strong>Payment Confirmed</strong>
                                    <p>Oct 24, 2023 at 10:31 AM</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className={styles.sideColumn}>
                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.sectionTitle}>Customer</h2>
                        <div className={styles.infoGroup}>
                            <div className={styles.customerName}>{order.customer.name}</div>
                            <a href={`mailto:${order.customer.email}`} className={styles.link}>
                                {order.customer.email}
                            </a>
                            <a href={`tel:${order.customer.phone}`} className={styles.link}>
                                {order.customer.phone}
                            </a>
                        </div>
                    </Card>

                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.sectionTitle}>Status</h2>
                        <div className={styles.statusControls}>
                            <select
                                className={styles.statusSelect}
                                value={status}
                                onChange={(e) => handleUpdateStatus(e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <Button variant="primary" fullWidth loading={loading}>
                                Update Status
                            </Button>
                        </div>
                    </Card>

                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.sectionTitle}>Shipping Address</h2>
                        <div className={styles.address}>
                            {order.shipping_address.line1}<br />
                            {order.shipping_address.line2}<br />
                            {order.shipping_address.city}, {order.shipping_address.state}<br />
                            {order.shipping_address.pincode}<br />
                            India
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
