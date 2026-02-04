'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from './page.module.css'

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState('smartphones')

    // Basic Info State
    const [formData, setFormData] = useState({
        title: '',
        sku: '',
        price: '',
        comparePrice: '',
        stock: '',
        condition: 'A',
        description: '',
    })

    // Dynamic specs based on category
    const [specs, setSpecs] = useState<Record<string, string>>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSpecChange = (name: string, value: string) => {
        setSpecs({ ...specs, [name]: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // TODO: Supabase integration
        // 1. Upload images
        // 2. Insert product
        // 3. Insert attributes

        setTimeout(() => {
            console.log('Product Data:', { ...formData, category, specs })
            setLoading(false)
            router.push('/admin/products')
        }, 1000)
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin/products" className={styles.backLink}>
                        ← Back to Products
                    </Link>
                    <h1 className={styles.title}>Add New Product</h1>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit} loading={loading}>
                        Save Product
                    </Button>
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.mainColumn}>
                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.cardTitle}>Basic Information</h2>
                        <div className={styles.formGroup}>
                            <Input
                                label="Product Title"
                                name="title"
                                placeholder="e.g. iPhone 13 Pro 128GB"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                name="description"
                                className={styles.textarea}
                                placeholder="Product description..."
                                rows={5}
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Card>

                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.cardTitle}>Media</h2>
                        <div className={styles.mediaUpload}>
                            <div className={styles.uploadBox}>
                                <span className={styles.uploadIcon}>📷</span>
                                <p>Drag and drop images here, or click to select</p>
                                <input type="file" multiple className={styles.fileInput} />
                            </div>
                        </div>
                    </Card>

                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.cardTitle}>Specifications</h2>
                        <div className={styles.specsGrid}>
                            {category === 'smartphones' && (
                                <>
                                    <Input
                                        label="Brand"
                                        value={specs.brand || ''}
                                        onChange={(e) => handleSpecChange('brand', e.target.value)}
                                        placeholder="e.g. Apple"
                                        fullWidth
                                    />
                                    <Input
                                        label="Model"
                                        value={specs.model || ''}
                                        onChange={(e) => handleSpecChange('model', e.target.value)}
                                        placeholder="e.g. iPhone 13 Pro"
                                        fullWidth
                                    />
                                    <Input
                                        label="Storage"
                                        value={specs.storage || ''}
                                        onChange={(e) => handleSpecChange('storage', e.target.value)}
                                        placeholder="e.g. 128GB"
                                        fullWidth
                                    />
                                    <Input
                                        label="Color"
                                        value={specs.color || ''}
                                        onChange={(e) => handleSpecChange('color', e.target.value)}
                                        placeholder="e.g. Sierra Blue"
                                        fullWidth
                                    />
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                <div className={styles.sideColumn}>
                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.cardTitle}>Organization</h2>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Category</label>
                            <select
                                className={styles.select}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="smartphones">Smartphones</option>
                                <option value="laptops">Laptops</option>
                                <option value="accessories">Accessories</option>
                                <option value="vehicles">Vehicles</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Condition</label>
                            <select
                                className={styles.select}
                                name="condition"
                                value={formData.condition}
                                onChange={handleInputChange}
                            >
                                <option value="A">Grade A (Like New)</option>
                                <option value="B">Grade B (Good)</option>
                                <option value="C">Grade C (Fair)</option>
                            </select>
                        </div>
                    </Card>

                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.cardTitle}>Pricing & Inventory</h2>
                        <div className={styles.formGroup}>
                            <Input
                                label="Price (₹)"
                                name="price"
                                type="number"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <Input
                                label="Compare at Price (₹)"
                                name="comparePrice"
                                type="number"
                                placeholder="0.00"
                                value={formData.comparePrice}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <Input
                                label="SKU"
                                name="sku"
                                placeholder="e.g. IP13-BLK"
                                value={formData.sku}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <Input
                                label="Stock Quantity"
                                name="stock"
                                type="number"
                                placeholder="0"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
