'use client'

import React from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import styles from './page.module.css'

export default function AdminProductsPage() {
    const products = [
        {
            id: 'PROD-001',
            title: 'iPhone 13 Pro 128GB - Sierra Blue',
            sku: 'IP13P-128-SB',
            price: 45999,
            stock: 5,
            status: 'active',
            category: 'Smartphones'
        },
        {
            id: 'PROD-002',
            title: 'Samsung Galaxy S21 FE 5G',
            sku: 'SAM-S21FE-OLV',
            price: 29999,
            stock: 0,
            status: 'out_of_stock',
            category: 'Smartphones'
        },
        {
            id: 'PROD-003',
            title: 'MacBook Air M1 2020',
            sku: 'MBA-M1-GLD',
            price: 65999,
            stock: 2,
            status: 'active',
            category: 'Laptops'
        }
    ]

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Products</h1>
                    <p className={styles.subtitle}>Manage your inventory</p>
                </div>
                <Link href="/admin/products/new">
                    <Button variant="primary">
                        <span style={{ marginRight: '8px' }}>+</span> Add Product
                    </Button>
                </Link>
            </div>

            <Card padding="lg" className={styles.tableCard}>
                <div className={styles.toolbar}>
                    <input
                        type="search"
                        placeholder="Search products..."
                        className={styles.searchInput}
                    />
                    <div className={styles.filters}>
                        <select className={styles.filterSelect}>
                            <option value="">All Categories</option>
                            <option value="smartphones">Smartphones</option>
                            <option value="laptops">Laptops</option>
                        </select>
                        <select className={styles.filterSelect}>
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                    </div>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div className={styles.productName}>{product.title}</div>
                                    <div className={styles.productId}>{product.id}</div>
                                </td>
                                <td>{product.sku}</td>
                                <td>{product.category}</td>
                                <td className={styles.price}>₹{product.price.toLocaleString()}</td>
                                <td>
                                    <span className={product.stock < 5 ? styles.lowStock : ''}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td>
                                    <Badge variant={product.status === 'active' ? 'success' : 'warning'} size="sm">
                                        {product.status.replace('_', ' ')}
                                    </Badge>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn} aria-label="Edit">✏️</button>
                                        <button className={styles.actionBtn} aria-label="Delete">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}
