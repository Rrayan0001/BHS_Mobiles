'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import styles from '../shared.module.css'

interface Product {
    id: string
    title: string
    sku: string
    price: number
    stock: number
    status: string
    images: string[]
    category: {
        name: string
        display_name: string
    }
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/admin/products')
            if (!response.ok) throw new Error('Failed to fetch products')

            const data = await response.json()
            setProducts(data.products || [])
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return

        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error)
            }

            alert('Product deleted successfully!')
            fetchProducts()
        } catch (error: any) {
            alert(error.message || 'Failed to delete product')
        }
    }

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (!response.ok) throw new Error('Failed to update status')

            fetchProducts()
        } catch (error: any) {
            alert(error.message || 'Failed to update status')
        }
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active': return styles.statusActive
            case 'draft': return styles.statusDraft
            case 'out_of_stock': return styles.statusOutOfStock
            default: return ''
        }
    }

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>Loading products...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.page}>
                <div className={styles.emptyState}>
                    <p className={styles.emptyStateTitle}>Error loading products</p>
                    <p className={styles.emptyStateText}>{error}</p>
                    <Button onClick={fetchProducts}>Try Again</Button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Products</h1>
                    <p className={styles.subtitle}>Manage your inventory and product listings</p>
                </div>
                <Link href="/admin/products/new">
                    <Button variant="primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <Input
                        placeholder="Search products by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                    />
                </div>
                <select
                    className={styles.filterSelect}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out_of_stock">Out of Stock</option>
                </select>
            </div>

            {/* Table */}
            {filteredProducts.length === 0 ? (
                <Card padding="lg">
                    <div className={styles.emptyState}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        </svg>
                        <p className={styles.emptyStateTitle}>No products found</p>
                        <p className={styles.emptyStateText}>
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your filters'
                                : 'Get started by adding your first product'}
                        </p>
                        {!searchTerm && statusFilter === 'all' && (
                            <Link href="/admin/products/new">
                                <Button variant="primary">Add Product</Button>
                            </Link>
                        )}
                    </div>
                </Card>
            ) : (
                <Card padding="none" className={styles.tableCard}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className={styles.productInfo}>
                                                <img
                                                    src={product.images[0] || '/placeholder.png'}
                                                    alt={product.title}
                                                    className={styles.productImage}
                                                />
                                                <div>
                                                    <div className={styles.productName}>{product.title}</div>
                                                    <div className={styles.productSku}>{product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product.category?.display_name || 'Unknown'}</td>
                                        <td>
                                            <span className={styles.price}>₹{product.price.toLocaleString()}</span>
                                        </td>
                                        <td>
                                            <span className={styles.stock}>{product.stock}</span>
                                        </td>
                                        <td>
                                            <select
                                                className={styles.statusSelect}
                                                value={product.status}
                                                onChange={(e) => handleStatusChange(product.id, e.target.value)}
                                            >
                                                <option value="active">Active</option>
                                                <option value="draft">Draft</option>
                                                <option value="out_of_stock">Sold Out</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                    <button className={styles.actionBtn} title="Edit">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.title)}
                                                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                    title="Delete"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Results count */}
            {filteredProducts.length > 0 && (
                <p style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
                    Showing  {filteredProducts.length} of {products.length} products
                </p>
            )}
        </div>
    )
}
