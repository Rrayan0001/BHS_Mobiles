'use client'

import React, { useState, useEffect } from 'react'
import styles from './page.module.css'

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
        return '★'.repeat(rating) + '☆'.repeat(5 - rating)
    }

    const getCardStyle = (status: string) => {
        switch (status) {
            case 'pending': return styles.reviewCardPending
            case 'approved': return styles.reviewCardApproved
            case 'rejected': return styles.reviewCardRejected
            default: return ''
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return styles.statusPending
            case 'approved': return styles.statusApproved
            case 'rejected': return styles.statusRejected
            default: return ''
        }
    }

    const filters = [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'All', value: 'all' },
    ]

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Product Reviews</h1>
                    <p className={styles.subtitle}>Moderate customer reviews and feedback</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className={styles.filterBar}>
                {filters.map((f) => (
                    <button
                        key={f.value}
                        className={`${styles.filterBtn} ${filter === f.value ? styles.filterBtnActive : ''}`}
                        onClick={() => setFilter(f.value)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className={styles.loadingState}>Loading reviews...</div>
            ) : reviews.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>⭐</div>
                    <p className={styles.emptyTitle}>No reviews found</p>
                    <p className={styles.emptyText}>
                        {filter === 'all'
                            ? 'No reviews have been submitted yet.'
                            : `No ${filter} reviews at this time.`}
                    </p>
                </div>
            ) : (
                <div className={styles.reviewsList}>
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className={`${styles.reviewCard} ${getCardStyle(review.status)}`}
                        >
                            <div className={styles.reviewHeader}>
                                <div className={styles.reviewMeta}>
                                    <h3 className={styles.customerName}>{review.customer_name}</h3>
                                    <div className={styles.stars}>
                                        {renderStars(review.rating)}
                                    </div>
                                    <p className={styles.productLabel}>
                                        Product: <span className={styles.productLabelName}>{review.product?.title || 'Unknown'}</span>
                                    </p>
                                    <div className={styles.reviewDate}>
                                        {new Date(review.created_at).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                                <div className={styles.reviewActions}>
                                    {review.status === 'pending' && (
                                        <>
                                            <button
                                                className={styles.approveBtn}
                                                onClick={() => handleStatusChange(review.id, 'approved')}
                                            >
                                                ✓ Approve
                                            </button>
                                            <button
                                                className={styles.rejectBtn}
                                                onClick={() => handleStatusChange(review.id, 'rejected')}
                                            >
                                                ✗ Reject
                                            </button>
                                        </>
                                    )}
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(review.id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            {review.review_text && (
                                <p className={styles.reviewText}>
                                    {review.review_text}
                                </p>
                            )}

                            <span className={`${styles.statusBadge} ${getStatusStyle(review.status)}`}>
                                {review.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
