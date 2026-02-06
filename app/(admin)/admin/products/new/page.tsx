'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from './page.module.css'

interface Category {
    id: string
    name: string
    display_name: string
}

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState<Category[]>([])
    const [uploadedImages, setUploadedImages] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)

    // Basic Info State
    const [formData, setFormData] = useState({
        title: '',
        sku: '',
        price: '',
        comparePrice: '',
        stock: '',
        condition: 'A',
        description: '',
        is_featured: false,
        featured_order: 0
    })

    // Dynamic specs based on category
    const [specs, setSpecs] = useState<Record<string, string>>({})

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categories')
            const data = await response.json()
            setCategories(data.categories || [])
            if (data.categories?.length > 0) {
                setCategory(data.categories[0].id)
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSpecChange = (name: string, value: string) => {
        setSpecs({ ...specs, [name]: value })
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        const newImages: string[] = []

        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData()
                formData.append('file', files[i])
                formData.append('productSlug', generateSlug(formData.get('title') as string || 'product'))

                const response = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (response.ok) {
                    const data = await response.json()
                    newImages.push(data.url)
                }
            }

            setUploadedImages([...uploadedImages, ...newImages])
        } catch (error) {
            console.error('Image upload failed:', error)
            alert('Failed to upload images')
        } finally {
            setUploading(false)
        }
    }

    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Prepare specifications array
            const specifications = Object.entries(specs)
                .filter(([_, value]) => value.trim() !== '')
                .map(([name, value]) => ({
                    spec_name: name,
                    spec_value: value
                }))

            // Create product
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    category_id: category,
                    sku: formData.sku,
                    price: formData.price,
                    compare_price: formData.comparePrice || null,
                    stock: formData.stock,
                    condition: formData.condition,
                    status: 'active',
                    images: uploadedImages,
                    is_featured: formData.is_featured,
                    featured_order: formData.featured_order,
                    specifications
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create product')
            }

            alert('Product created successfully!')
            router.push('/admin/products')
        } catch (error: any) {
            console.error('Failed to create product:', error)
            alert(error.message || 'Failed to create product')
        } finally {
            setLoading(false)
        }
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
                                <p>{uploading ? 'Uploading...' : 'Drag and drop images here, or click to select'}</p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className={styles.fileInput}
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </div>
                            {uploadedImages.length > 0 && (
                                <div style={{ marginTop: '16px' }}>
                                    <p style={{ marginBottom: '8px', fontSize: '14px' }}>
                                        Uploaded: {uploadedImages.length} image(s)
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {uploadedImages.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`Upload ${index + 1}`}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.cardTitle}>Specifications</h2>
                        <div className={styles.specsGrid}>
                            {(category === 'phones' || category === 'smartphones') && (
                                <>
                                    <Input
                                        label="Brand"
                                        value={specs.brand || ''}
                                        onChange={(e) => handleSpecChange('brand', e.target.value)}
                                        placeholder="e.g. Apple, Samsung, OnePlus"
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
                                        label="Year"
                                        value={specs.year || ''}
                                        onChange={(e) => handleSpecChange('year', e.target.value)}
                                        placeholder="e.g. 2023"
                                        fullWidth
                                    />
                                    <Input
                                        label="Storage"
                                        value={specs.storage || ''}
                                        onChange={(e) => handleSpecChange('storage', e.target.value)}
                                        placeholder="e.g. 128GB, 256GB"
                                        fullWidth
                                    />
                                    <Input
                                        label="Color"
                                        value={specs.color || ''}
                                        onChange={(e) => handleSpecChange('color', e.target.value)}
                                        placeholder="e.g. Sierra Blue, Midnight"
                                        fullWidth
                                    />
                                </>
                            )}
                            {category === 'watches' && (
                                <>
                                    <Input
                                        label="Brand"
                                        value={specs.brand || ''}
                                        onChange={(e) => handleSpecChange('brand', e.target.value)}
                                        placeholder="e.g. Apple, Samsung, Fitbit"
                                        fullWidth
                                    />
                                    <Input
                                        label="Model"
                                        value={specs.model || ''}
                                        onChange={(e) => handleSpecChange('model', e.target.value)}
                                        placeholder="e.g. Apple Watch Series 8"
                                        fullWidth
                                    />
                                    <Input
                                        label="Size"
                                        value={specs.size || ''}
                                        onChange={(e) => handleSpecChange('size', e.target.value)}
                                        placeholder="e.g. 41mm, 45mm"
                                        fullWidth
                                    />
                                    <Input
                                        label="Color/Band"
                                        value={specs.color || ''}
                                        onChange={(e) => handleSpecChange('color', e.target.value)}
                                        placeholder="e.g. Starlight Aluminum"
                                        fullWidth
                                    />
                                </>
                            )}
                            {category === 'laptops' && (
                                <>
                                    <Input
                                        label="Brand"
                                        value={specs.brand || ''}
                                        onChange={(e) => handleSpecChange('brand', e.target.value)}
                                        placeholder="e.g. Apple, Dell, HP"
                                        fullWidth
                                    />
                                    <Input
                                        label="Model"
                                        value={specs.model || ''}
                                        onChange={(e) => handleSpecChange('model', e.target.value)}
                                        placeholder="e.g. MacBook Air M1"
                                        fullWidth
                                    />
                                    <Input
                                        label="Processor"
                                        value={specs.processor || ''}
                                        onChange={(e) => handleSpecChange('processor', e.target.value)}
                                        placeholder="e.g. M1, Intel i7"
                                        fullWidth
                                    />
                                    <Input
                                        label="RAM"
                                        value={specs.ram || ''}
                                        onChange={(e) => handleSpecChange('ram', e.target.value)}
                                        placeholder="e.g. 8GB, 16GB"
                                        fullWidth
                                    />
                                    <Input
                                        label="Storage"
                                        value={specs.storage || ''}
                                        onChange={(e) => handleSpecChange('storage', e.target.value)}
                                        placeholder="e.g. 256GB SSD"
                                        fullWidth
                                    />
                                </>
                            )}
                            {category === 'airpods' && (
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
                                        placeholder="e.g. AirPods Pro 2nd Gen"
                                        fullWidth
                                    />
                                    <Input
                                        label="Features"
                                        value={specs.features || ''}
                                        onChange={(e) => handleSpecChange('features', e.target.value)}
                                        placeholder="e.g. Noise Cancellation, Wireless Charging"
                                        fullWidth
                                    />
                                </>
                            )}
                            {(category === 'chargers' || category === 'screen-protectors' || category === 'back-skins') && (
                                <>
                                    <Input
                                        label="Brand"
                                        value={specs.brand || ''}
                                        onChange={(e) => handleSpecChange('brand', e.target.value)}
                                        placeholder="e.g. Apple, Anker, Generic"
                                        fullWidth
                                    />
                                    <Input
                                        label="Type/Model"
                                        value={specs.type || ''}
                                        onChange={(e) => handleSpecChange('type', e.target.value)}
                                        placeholder={category === 'chargers' ? 'e.g. 20W USB-C' : category === 'screen-protectors' ? 'e.g. Tempered Glass, Bulletproof' : 'e.g. Matte, Carbon Fiber'}
                                        fullWidth
                                    />
                                    <Input
                                        label="Compatible With"
                                        value={specs.compatibility || ''}
                                        onChange={(e) => handleSpecChange('compatibility', e.target.value)}
                                        placeholder="e.g. iPhone 13, All iPhones"
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
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.display_name}
                                    </option>
                                ))}
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
                                <option value="A">A - Like New / Excellent</option>
                                <option value="B">B - Good / Minor Wear</option>
                                <option value="C">C - Fair / Visible Wear</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured || false}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                />
                                <span>Mark as Featured (Top Picks)</span>
                            </label>
                        </div>

                        {formData.is_featured && (
                            <div className={styles.formGroup}>
                                <Input
                                    label="Featured Order"
                                    type="number"
                                    value={formData.featured_order || 0}
                                    onChange={(e) => setFormData({ ...formData, featured_order: parseInt(e.target.value) })}
                                    placeholder="0"
                                    fullWidth
                                />
                            </div>
                        )}
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
