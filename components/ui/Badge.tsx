import React from 'react'
import styles from './Badge.module.css'

export interface BadgeProps {
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral'
    size?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
    className?: string
}

export default function Badge({
    variant = 'neutral',
    size = 'md',
    children,
    className = '',
}: BadgeProps) {
    const classNames = [
        styles.badge,
        styles[variant],
        styles[size],
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return <span className={classNames}>{children}</span>
}
