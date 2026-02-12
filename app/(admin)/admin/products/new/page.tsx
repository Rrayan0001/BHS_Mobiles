'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
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
    const [phoneType, setPhoneType] = useState<'android' | 'iphone' | ''>('')

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
                    price: parseFloat(formData.price) || 0,
                    compare_price: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
                    stock: parseInt(formData.stock) || 0,
                    condition: formData.condition,
                    status: 'draft',
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
                    <button className={styles.cancelBtn} onClick={() => router.back()}>Cancel</button>
                    <button className={styles.saveBtn} onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Saving...' : '✓ Save Product'}
                    </button>
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.mainColumn}>
                    <div className={styles.card}>
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
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Media</h2>
                        <div className={styles.mediaUpload}>
                            <div className={styles.uploadBox}>
                                <span className={styles.uploadIcon}>📷</span>
                                <p className={styles.uploadText}>{uploading ? 'Uploading...' : 'Drag and drop images here, or click to select'}</p>
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
                                <div className={styles.imagePreviewArea}>
                                    <p className={styles.imagePreviewLabel}>
                                        Uploaded: {uploadedImages.length} image(s)
                                    </p>
                                    <div className={styles.imageGrid}>
                                        {uploadedImages.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`Upload ${index + 1}`}
                                                className={styles.imagePreview}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Specifications</h2>
                        <div className={styles.specsGrid}>
                            {(() => {
                                const selectedCategory = categories.find(c => c.id === category)
                                const slug = selectedCategory?.name || '' // using name/slug from DB

                                if (slug === 'phones' || slug === 'smartphones') {
                                    return (
                                        <>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Device Type (Auto-fills OS)</label>
                                                <div className={styles.radioGroup} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                        <input
                                                            type="radio"
                                                            name="phoneType"
                                                            value="iphone"
                                                            checked={phoneType === 'iphone'}
                                                            onChange={() => {
                                                                setPhoneType('iphone')
                                                                handleSpecChange('os', 'iOS')
                                                                handleSpecChange('brand', 'Apple')
                                                            }}
                                                        />
                                                        iPhone
                                                    </label>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                        <input
                                                            type="radio"
                                                            name="phoneType"
                                                            value="android"
                                                            checked={phoneType === 'android'}
                                                            onChange={() => {
                                                                setPhoneType('android')
                                                                handleSpecChange('os', 'Android')
                                                                handleSpecChange('brand', '')
                                                            }}
                                                        />
                                                        Android
                                                    </label>
                                                </div>
                                            </div>

                                            <div className={styles.grid2} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <Input
                                                    label="Brand"
                                                    value={specs.brand || ''}
                                                    onChange={(e) => handleSpecChange('brand', e.target.value)}
                                                    placeholder="e.g. Samsung, OnePlus"
                                                    fullWidth
                                                />
                                                <Input
                                                    label="Model"
                                                    value={specs.model || ''}
                                                    onChange={(e) => handleSpecChange('model', e.target.value)}
                                                    placeholder="e.g. Galaxy S23 Ultra"
                                                    fullWidth
                                                />
                                            </div>

                                            <div className={styles.grid2} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <Input
                                                    label="Storage"
                                                    value={specs.storage || ''}
                                                    onChange={(e) => handleSpecChange('storage', e.target.value)}
                                                    placeholder="e.g. 256GB"
                                                    fullWidth
                                                />
                                                <Input
                                                    label="RAM"
                                                    value={specs.ram || ''}
                                                    onChange={(e) => handleSpecChange('ram', e.target.value)}
                                                    placeholder="e.g. 8GB, 12GB"
                                                    fullWidth
                                                />
                                            </div>

                                            <div className={styles.grid2} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <Input
                                                    label="Color"
                                                    value={specs.color || ''}
                                                    onChange={(e) => handleSpecChange('color', e.target.value)}
                                                    placeholder="e.g. Phantom Black"
                                                    fullWidth
                                                />
                                                <Input
                                                    label="Screen Size"
                                                    value={specs.screen_size || ''}
                                                    onChange={(e) => handleSpecChange('screen_size', e.target.value)}
                                                    placeholder="e.g. 6.8 inches"
                                                    fullWidth
                                                />
                                            </div>

                                            <Input
                                                label="Processor"
                                                value={specs.processor || ''}
                                                onChange={(e) => handleSpecChange('processor', e.target.value)}
                                                placeholder="e.g. Snapdragon 8 Gen 2"
                                                fullWidth
                                            />

                                            <div className={styles.grid2} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <Input
                                                    label="Main Camera"
                                                    value={specs.main_camera || ''}
                                                    onChange={(e) => handleSpecChange('main_camera', e.target.value)}
                                                    placeholder="e.g. 200MP + 12MP + 10MP"
                                                    fullWidth
                                                />
                                                <Input
                                                    label="Selfie Camera"
                                                    value={specs.selfie_camera || ''}
                                                    onChange={(e) => handleSpecChange('selfie_camera', e.target.value)}
                                                    placeholder="e.g. 12MP"
                                                    fullWidth
                                                />
                                            </div>

                                            <div className={styles.grid2} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <Input
                                                    label="Battery"
                                                    value={specs.battery || ''}
                                                    onChange={(e) => handleSpecChange('battery', e.target.value)}
                                                    placeholder="e.g. 5000mAh"
                                                    fullWidth
                                                />
                                                <Input
                                                    label="Operating System"
                                                    value={specs.os || ''}
                                                    onChange={(e) => handleSpecChange('os', e.target.value)}
                                                    placeholder="e.g. Android 13 / iOS 16"
                                                    fullWidth
                                                />
                                            </div>
                                        </>
                                    )
                                }

                                if (slug === 'watches') {
                                    return (
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
                                    )
                                }

                                if (slug === 'laptops') {
                                    return (
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
                                    )
                                }

                                if (slug === 'airpods') {
                                    return (
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
                                    )
                                }

                                if (['chargers', 'screen-protectors', 'back-skins'].includes(slug)) {
                                    return (
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
                                                placeholder={slug === 'chargers' ? 'e.g. 20W USB-C' : slug === 'screen-protectors' ? 'e.g. Tempered Glass, Bulletproof' : 'e.g. Matte, Carbon Fiber'}
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
                                    )
                                }

                                // Fallback
                                return (
                                    <div className={styles.specsFallback}>
                                        Select a category to view specific fields. If no specific fields appear, you can add generic details in the description.
                                    </div>
                                )
                            })()}
                        </div>
                    </div>
                </div>

                <div className={styles.sideColumn}>
                    <div className={styles.card}>
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

                        {/* Phone Type Selection in Organization Card for Quick Access */}
                        {(categories.find(c => c.id === category)?.name === 'phones' || categories.find(c => c.id === category)?.name === 'smartphones') && (
                            <div className={styles.formGroup} style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <label className={styles.label} style={{ marginBottom: '8px', display: 'block' }}>Phone Type</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPhoneType('iphone')
                                            handleSpecChange('os', 'iOS')
                                            handleSpecChange('brand', 'Apple')
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            borderRadius: '6px',
                                            border: phoneType === 'iphone' ? '2px solid #6366f1' : '1px solid #d1d5db',
                                            background: phoneType === 'iphone' ? '#eef2ff' : 'white',
                                            color: phoneType === 'iphone' ? '#4f46e5' : '#374151',
                                            fontWeight: 500,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        iPhone
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPhoneType('android')
                                            handleSpecChange('os', 'Android')
                                            handleSpecChange('brand', '')
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            borderRadius: '6px',
                                            border: phoneType === 'android' ? '2px solid #6366f1' : '1px solid #d1d5db',
                                            background: phoneType === 'android' ? '#eef2ff' : 'white',
                                            color: phoneType === 'android' ? '#4f46e5' : '#374151',
                                            fontWeight: 500,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Android
                                    </button>
                                </div>
                            </div>
                        )}

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
                            <label className={styles.checkboxLabel}>
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
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Pricing & Inventory</h2>
                        <div className={styles.formGroup}>
                            <Input
                                label="Sliced Price / MRP (₹)"
                                name="comparePrice"
                                type="number"
                                placeholder="e.g. 18000"
                                value={formData.comparePrice}
                                onChange={handleInputChange}
                                helperText="Original price before discount (shown with strikethrough)"
                                fullWidth
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <Input
                                label="Discounted Price (₹)"
                                name="price"
                                type="number"
                                placeholder="e.g. 15000"
                                value={formData.price}
                                onChange={handleInputChange}
                                helperText="Final selling price the customer pays"
                                required
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
                                helperText="Stock Keeping Unit: A unique ID to track this product"
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
                    </div>
                </div>
            </div>
        </div>
    )
}
