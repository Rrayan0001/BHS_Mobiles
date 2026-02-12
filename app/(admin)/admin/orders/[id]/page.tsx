'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import styles from './page.module.css'

interface OrderItem {
    id: string
    product_title: string
    product_sku: string
    price: number
    quantity: number
    subtotal: number
}

interface Order {
    id: string
    order_number: string
    email: string
    status: string
    subtotal: number
    tax: number
    shipping: number
    total: number
    payment_method: string
    payment_status: string
    shipping_address: any
    created_at: string
    order_items: OrderItem[]
}

export default function OrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [newStatus, setNewStatus] = useState('')

    useEffect(() => {
        fetchOrder()
    }, [id])

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/admin/orders/${id}`)
            if (response.ok) {
                const data = await response.json()
                setOrder(data.order)
                setNewStatus(data.order.status)
            }
        } catch (error) {
            console.error('Error fetching order:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async () => {
        if (!order || newStatus === order.status) return

        try {
            setUpdating(true)
            const response = await fetch(`/api/admin/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                const data = await response.json()
                setOrder(data.order)
                alert('Order status updated successfully')
            } else {
                alert('Failed to update status')
            }
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Error updating status')
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return <div className={styles.page}><div className="container">Loading order details...</div></div>
    }

    if (!order) {
        return (
            <div className={styles.page}>
                <div className="container">
                    <Card padding="lg">
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <h2>Order Not Found</h2>
                            <p>The requested order could not be found.</p>
                            <Link href="/admin/orders">
                                <Button variant="outline">Back to Orders</Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin/orders" className={styles.backLink}>
                        <ArrowLeft size={16} /> Back to Orders
                    </Link>
                    <div className={styles.titleWrapper}>
                        <h1 className={styles.title}>Order #{order.order_number}</h1>
                        <Badge
                            variant={
                                order.status === 'delivered' ? 'success' :
                                    order.status === 'shipped' ? 'primary' :
                                        order.status === 'cancelled' ? 'error' : 'warning'
                            }
                        >
                            {order.status.toUpperCase()}
                        </Badge>
                    </div>
                    <div className={styles.date}>
                        Placed on {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
                    </div>
                </div>
                <div className={styles.headerActions}>
                    {/* Add Print/Invoice buttons here if needed */}
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.mainColumn}>
                    <Card padding="none" className={styles.card}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Order Items</h3>
                        </div>
                        <div style={{ padding: '0 20px 20px' }}>
                            <table className={styles.itemsTable}>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th style={{ textAlign: 'right' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.order_items.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className={styles.productCell}>
                                                    <div className={styles.productImage}>📱</div>
                                                    <div className={styles.productInfo}>
                                                        <span className={styles.productName}>{item.product_title}</span>
                                                        <span className={styles.productSku}>SKU: {item.product_sku || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={styles.price}>₹{item.price.toLocaleString()}</td>
                                            <td>{item.quantity}</td>
                                            <td className={styles.total} style={{ textAlign: 'right' }}>
                                                ₹{item.subtotal.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className={styles.summaryGrid}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>₹{order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Shipping</span>
                                    <span>₹{order.shipping.toLocaleString()}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Tax</span>
                                    <span>₹{order.tax.toLocaleString()}</span>
                                </div>
                                <div className={styles.summaryTotal}>
                                    <span>Total</span>
                                    <span>₹{order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Payment Info Card */}
                    <Card padding="lg" className={styles.card}>
                        <h3>Payment Information</h3>
                        <div className={styles.summaryGrid} style={{ marginTop: 0, border: 'none', paddingTop: 0 }}>
                            <div className={styles.summaryRow}>
                                <span>Payment Method</span>
                                <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>{order.payment_method}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Payment Status</span>
                                <Badge variant={order.payment_status === 'paid' ? 'success' : 'warning'} size="sm">
                                    {order.payment_status?.toUpperCase() || 'PENDING'}
                                </Badge>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className={styles.sideColumn}>
                    {/* Status Update Card */}
                    <Card padding="lg" className={styles.card}>
                        <h3>Update Status</h3>
                        <div className={styles.statusControls}>
                            <select
                                className={styles.statusSelect}
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <Button
                                variant="primary"
                                size="md"
                                className={styles.updateBtn}
                                onClick={handleUpdateStatus}
                                loading={updating}
                                disabled={newStatus === order.status}
                            >
                                Update Status
                            </Button>
                        </div>
                    </Card>

                    {/* Customer Details Card */}
                    <Card padding="lg" className={styles.card}>
                        <h3>Customer Details</h3>
                        <div className={styles.detailsList}>
                            <div className={styles.infoGroup}>
                                <div className={styles.productCell}>
                                    <div className={styles.productImage} style={{ borderRadius: '50%', width: 40, height: 40 }}>
                                        👤
                                    </div>
                                    <div className={styles.infoGroup}>
                                        <span className={styles.customerName}>
                                            {order.shipping_address?.fullName || 'Guest Customer'}
                                        </span>
                                        <span className={styles.infoValue}>{order.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.infoLabel}>Contact</span>
                                <span className={styles.infoValue}>
                                    {order.shipping_address?.phone || 'No phone provided'}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Shipping Address Card */}
                    <Card padding="lg" className={styles.card}>
                        <h3>Shipping Address</h3>
                        <div className={styles.infoGroup}>
                            <div className={styles.address}>
                                {order.shipping_address ? (
                                    <>
                                        {order.shipping_address.address}<br />
                                        {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                                    </>
                                ) : (
                                    <span style={{ color: '#9ca3af' }}>No address provided</span>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
