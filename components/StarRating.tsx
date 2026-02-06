import React from 'react'

interface StarRatingProps {
    rating: number
    size?: 'sm' | 'md' | 'lg'
    showCount?: boolean
    count?: number
}

export default function StarRating({ rating, size = 'md', showCount = false, count }: StarRatingProps) {
    const fontSize = size === 'sm' ? '14px' : size === 'lg' ? '24px' : '18px'

    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', fontSize, color: '#fbbf24' }}>
                {'★'.repeat(fullStars)}
                {hasHalfStar && '⯨'}
                <span style={{ color: '#d1d5db' }}>
                    {'☆'.repeat(emptyStars)}
                </span>
            </div>
            {showCount && count !== undefined && (
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    ({count})
                </span>
            )}
        </div>
    )
}
