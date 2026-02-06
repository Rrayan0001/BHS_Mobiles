'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from '../categories/page.module.css'

interface Review {
    id: string
    product_id: string
    customer_name: string
    rating: number
    review_text: string | null
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
    product?: {
        id: string
        title: string
    }
}

export default function ReviewsModerationPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('pending')

    useEffect(() => {
        fetchReviews()
    }, [filter])

    const fetchReviews = async () => {
        try {
            const url = filter === 'all'
                ? '/api/admin/reviews'
                : `/api/admin/reviews?status=${filter}`

            const response = await fetch(url)
            const data = await response.json()
            setReviews(data.reviews || [])
        } catch (error) {
            console.error('Failed to fetch reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
        try {
            const response = await fetch(`/api/admin/reviews/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })

            if (!response.ok) throw new Error('Failed to update review')

            alert(`Review ${status}!`)
            fetchReviews()
        } catch (error) {
            alert('Failed to update review status')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return

        try {
            const response = await fetch(`/api/admin/reviews/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Failed to delete review')

            alert('Review deleted!')
            fetchReviews()
        } catch (error) {
            alert('Failed to delete review')
        }
    }

    const renderStars = (rating: number) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Product Reviews</h1>
                    <p className={styles.subtitle}>Moderate customer reviews</p>
                </div>
            </div>

            <Card padding="lg">
                <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                    <Button
                        variant={filter === 'pending' ? 'primary' : 'secondary'}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filter === 'approved' ? 'primary' : 'secondary'}
                        onClick={() => setFilter('approved')}
                    >
                        Approved
                    </Button>
                    <Button
                        variant={filter === 'rejected' ? 'primary' : 'secondary'}
                        onClick={() => setFilter('rejected')}
                    >
                        Rejected
                    </Button>
                    <Button
                        variant={filter === 'all' ? 'primary' : 'secondary'}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                </div>

                {loading ? (
                    <p>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <p>No reviews found.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {reviews.map((review) => (
                            <div key={review.id} style={{
                                padding: '16px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor:
                                    review.status === 'approved' ? '#f0fdf4' :
                                        review.status === 'rejected' ? '#fef2f2' : '#fefce8'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0' }}>{review.customer_name}</h3>
                                        <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                                            {renderStars(review.rating)}
                                        </div>
                                        <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                                            Product: {review.product?.title || 'Unknown'}
                                        </p>
                                        <p style={{ margin: '4px 0', fontSize: '12px', color: '#888' }}>
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                        {review.status === 'pending' && (
                                            <>
                                                <Button
                                                    variant="success"
                                                    onClick={() => handleStatusChange(review.id, 'approved')}
                                                    size="sm"
                                                >
                                                    ✓ Approve
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleStatusChange(review.id, 'rejected')}
                                                    size="sm"
                                                >
                                                    ✗ Reject
                                                </Button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className={styles.actionBtn}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                {review.review_text && (
                                    <p style={{
                                        margin: '8px 0 0 0',
                                        padding: '12px',
                                        backgroundColor: 'white',
                                        borderRadius: '4px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        {review.review_text}
                                    </p>
                                )}
                                <div style={{
                                    marginTop: '8px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: review.status === 'approved' ? '#059669' :
                                        review.status === 'rejected' ? '#dc2626' : '#ca8a04'
                                }}>
                                    Status: {review.status.toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}
