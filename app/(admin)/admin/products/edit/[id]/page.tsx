'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from './page.module.css'

interface Category {
    id: string
    name: string
    display_name: string
}

export default function EditProductPage() {
    const router = useRouter()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState<Category[]>([])
    const [uploadedImages, setUploadedImages] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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
        featured_order: 0,
        status: 'active'
    })

    // Dynamic specs
    const [specs, setSpecs] = useState<Record<string, string>>({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const catResponse = await fetch('/api/admin/categories')
                const catData = await catResponse.json()
                setCategories(catData.categories || [])

                // Fetch product
                const prodResponse = await fetch(`/api/admin/products/${id}`)
                if (!prodResponse.ok) throw new Error('Failed to fetch product')

                const prodData = await prodResponse.json()
                const product = prodData.product

                // Set form data
                setFormData({
                    title: product.title,
                    sku: product.sku || '',
                    price: product.price.toString(),
                    comparePrice: product.compare_price ? product.compare_price.toString() : '',
                    stock: product.stock.toString(),
                    condition: product.condition,
                    description: product.description || '',
                    is_featured: product.is_featured || false,
                    featured_order: product.featured_order || 0,
                    status: product.status
                })

                setCategory(product.category_id)
                setUploadedImages(product.images || [])

                // Set specifications
                if (product.specifications) {
                    const specsObj: Record<string, string> = {}
                    product.specifications.forEach((spec: any) => {
                        specsObj[spec.spec_name] = spec.spec_value
                    })
                    setSpecs(specsObj)
                }

                setLoading(false)
            } catch (err: any) {
                console.error('Error fetching data:', err)
                setError(err.message)
                setLoading(false)
            }
        }

        if (id) {
            fetchData()
        }
    }, [id])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        setFormData({ ...formData, [name]: val })
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

    const removeImage = (index: number) => {
        const newImages = [...uploadedImages]
        newImages.splice(index, 1)
        setUploadedImages(newImages)
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
        setSaving(true)

        try {
            // Prepare specifications array
            const specifications = Object.entries(specs)
                .filter(([_, value]) => value.trim() !== '')
                .map(([name, value]) => ({
                    spec_name: name,
                    spec_value: value
                }))

            // Update product
            const response = await fetch(`/api/admin/products/${id}`, {
                method: 'PUT',
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
                    status: formData.status,
                    images: uploadedImages,
                    is_featured: formData.is_featured,
                    featured_order: formData.featured_order,
                    specifications
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update product')
            }

            alert('Product updated successfully!')
            router.push('/admin/products')
        } catch (error: any) {
            console.error('Failed to update product:', error)
            alert(error.message || 'Failed to update product')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className={styles.loading}>Loading product details...</div>
    if (error) return <div className={styles.error}>{error}</div>

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link href="/admin/products" className={styles.backLink}>
                    ← Back to Products
                </Link>
                <h1 className={styles.title}>Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
                <div className={styles.mainColumn}>
                    {/* Basic Info */}
                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.cardTitle}>Basic Information</h2>
                        <div className={styles.formGroup}>
                            <Input
                                label="Product Title"
                                name="title"
                                placeholder="e.g. iPhone 13 Pro Max"
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
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                            />
                        </div>
                    </Card>

                    {/* Media */}
                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.cardTitle}>Media</h2>
                        <div className={styles.imageUploadArea}>
                            {uploadedImages.length > 0 ? (
                                <div className={styles.imageGrid}>
                                    {uploadedImages.map((url, index) => (
                                        <div key={index} className={styles.imagePreview}>
                                            <img src={url} alt={`Product ${index + 1}`} />
                                            <button
                                                type="button"
                                                className={styles.removeImageBtn}
                                                onClick={() => removeImage(index)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <label className={styles.addImageBtn}>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            hidden
                                            disabled={uploading}
                                        />
                                        <span>+ Add</span>
                                    </label>
                                </div>
                            ) : (
                                <label className={styles.uploadPlaceholder}>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        hidden
                                        disabled={uploading}
                                    />
                                    <div className={styles.uploadIcon}>📷</div>
                                    <span>Drag and drop images here, or click to select</span>
                                </label>
                            )}
                            {uploading && <p className={styles.uploadingText}>Uploading...</p>}
                        </div>
                    </Card>

                    {/* Specifications */}
                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.cardTitle}>Specifications</h2>
                        <div className={styles.specsGrid}>
                            <div className={styles.specItem}>
                                <Input
                                    label="RAM"
                                    value={specs['RAM'] || ''}
                                    onChange={(e) => handleSpecChange('RAM', e.target.value)}
                                    placeholder="e.g. 8GB"
                                    fullWidth
                                />
                            </div>
                            <div className={styles.specItem}>
                                <Input
                                    label="Storage"
                                    value={specs['Storage'] || ''}
                                    onChange={(e) => handleSpecChange('Storage', e.target.value)}
                                    placeholder="e.g. 128GB"
                                    fullWidth
                                />
                            </div>
                            <div className={styles.specItem}>
                                <Input
                                    label="Color"
                                    value={specs['Color'] || ''}
                                    onChange={(e) => handleSpecChange('Color', e.target.value)}
                                    placeholder="e.g. Midnight Black"
                                    fullWidth
                                />
                            </div>
                            <div className={styles.specItem}>
                                <Input
                                    label="Processor"
                                    value={specs['Processor'] || ''}
                                    onChange={(e) => handleSpecChange('Processor', e.target.value)}
                                    placeholder="e.g. A15 Bionic"
                                    fullWidth
                                />
                            </div>
                        </div>
                        <p className={styles.helperText}>
                            Add specific details about the product. These will appear in the specifications table.
                        </p>
                    </Card>
                </div>

                <div className={styles.sideColumn}>
                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.cardTitle}>Status</h2>
                        <div className={styles.formGroup}>
                            <select
                                name="status"
                                className={styles.select}
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </select>
                        </div>
                    </Card>

                    <Card padding="lg" className={styles.card}>
                        <h2 className={styles.cardTitle}>Organization</h2>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Category</label>
                            <select
                                className={styles.select}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select Category</option>
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
                                name="condition"
                                className={styles.select}
                                value={formData.condition}
                                onChange={handleInputChange}
                            >
                                <option value="A">A - Like New / Excellent</option>
                                <option value="B">B - Good / Minor Scratches</option>
                                <option value="C">C - Fair / Visible Wear</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleInputChange}
                                />
                                <span style={{ marginLeft: '8px' }}>Mark as Featured (Top Picks)</span>
                            </label>
                        </div>
                    </Card>

                    <Card padding="lg" className={styles.card}>
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
                    </Card>

                    <div className={styles.actions}>
                        <Link href="/admin/products">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button variant="primary" type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
