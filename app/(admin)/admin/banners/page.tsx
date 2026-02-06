'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import styles from '../categories/page.module.css'

interface Banner {
    id: string
    title: string
    subtitle: string | null
    image_url: string
    link_url: string | null
    button_text: string
    is_active: boolean
    display_order: number
}

export default function BannerManagementPage() {
    const [banners, setBanners] = useState<Banner[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image_url: '',
        link_url: '',
        button_text: 'Shop Now',
        is_active: false,
        display_order: 0
    })

    useEffect(() => {
        fetchBanners()
    }, [])

    const fetchBanners = async () => {
        try {
            const response = await fetch('/api/admin/banners')
            const data = await response.json()
            setBanners(data.banners || [])
        } catch (error) {
            console.error('Failed to fetch banners:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const uploadFormData = new FormData()
            uploadFormData.append('file', file)
            uploadFormData.append('productSlug', 'banner')

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: uploadFormData
            })

            if (response.ok) {
                const data = await response.json()
                setFormData({ ...formData, image_url: data.url })
            }
        } catch (error) {
            console.error('Image upload failed:', error)
            alert('Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = editingBanner
                ? `/api/admin/banners/${editingBanner.id}`
                : '/api/admin/banners'

            const method = editingBanner ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error)
            }

            alert(editingBanner ? 'Banner updated!' : 'Banner created!')
            setShowModal(false)
            setFormData({
                title: '',
                subtitle: '',
                image_url: '',
                link_url: '',
                button_text: 'Shop Now',
                is_active: false,
                display_order: 0
            })
            setEditingBanner(null)
            fetchBanners()
        } catch (error: any) {
            alert(error.message || 'Failed to save banner')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (banner: Banner) => {
        setEditingBanner(banner)
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle || '',
            image_url: banner.image_url,
            link_url: banner.link_url || '',
            button_text: banner.button_text,
            is_active: banner.is_active,
            display_order: banner.display_order
        })
        setShowModal(true)
    }

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return

        try {
            const response = await fetch(`/api/admin/banners/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error)
            }

            alert('Banner deleted!')
            fetchBanners()
        } catch (error: any) {
            alert(error.message || 'Failed to delete banner')
        }
    }

    const openAddModal = () => {
        setEditingBanner(null)
        setFormData({
            title: '',
            subtitle: '',
            image_url: '',
            link_url: '',
            button_text: 'Shop Now',
            is_active: false,
            display_order: 0
        })
        setShowModal(true)
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Hero Banners</h1>
                    <p className={styles.subtitle}>Manage homepage hero section</p>
                </div>
                <Button variant="primary" onClick={openAddModal}>
                    <span style={{ marginRight: '8px' }}>+</span> Add Banner
                </Button>
            </div>

            <Card padding="lg">
                {loading ? (
                    <p>Loading...</p>
                ) : banners.length === 0 ? (
                    <p>No banners found. Create your first banner!</p>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {banners.map((banner) => (
                            <div key={banner.id} style={{
                                display: 'flex',
                                gap: '16px',
                                padding: '16px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor: banner.is_active ? '#f0f9ff' : '#fff'
                            }}>
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    style={{ width: '200px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 4px 0' }}>{banner.title}</h3>
                                    <p style={{ margin: '0 0 8px 0', color: '#666' }}>{banner.subtitle}</p>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#888' }}>
                                        <span>Order: {banner.display_order}</span>
                                        <span>•</span>
                                        <span>{banner.is_active ? '🟢 Active' : '⚫ Inactive'}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <button
                                        onClick={() => handleEdit(banner)}
                                        className={styles.actionBtn}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner.id, banner.title)}
                                        className={styles.actionBtn}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Modal */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <Input
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Summer Sale 2024"
                                required
                                fullWidth
                            />
                            <Input
                                label="Subtitle"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                placeholder="e.g. Up to 50% off on selected items"
                                fullWidth
                            />

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                                    Banner Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ marginBottom: '8px' }}
                                />
                                {formData.image_url && (
                                    <img
                                        src={formData.image_url}
                                        alt="Preview"
                                        style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                )}
                                {uploading && <p>Uploading...</p>}
                            </div>

                            <Input
                                label="Link URL"
                                value={formData.link_url}
                                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                placeholder="/category/phones"
                                fullWidth
                            />
                            <Input
                                label="Button Text"
                                value={formData.button_text}
                                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                placeholder="Shop Now"
                                fullWidth
                            />
                            <Input
                                label="Display Order"
                                type="number"
                                value={formData.display_order.toString()}
                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                fullWidth
                            />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    id="is_active"
                                />
                                <label htmlFor="is_active">Set as Active</label>
                            </div>

                            <div className={styles.modalActions}>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setShowModal(false)
                                        setEditingBanner(null)
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" disabled={loading || uploading || !formData.image_url}>
                                    {loading ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
