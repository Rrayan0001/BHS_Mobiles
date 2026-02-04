import React from 'react'
import styles from './Card.module.css'

export interface CardProps {
    children: React.ReactNode
    variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    hover?: boolean
    className?: string
    onClick?: () => void
}

export default function Card({
    children,
    variant = 'default',
    padding = 'md',
    hover = false,
    className = '',
    onClick,
}: CardProps) {
    const classNames = [
        styles.card,
        styles[variant],
        styles[`padding-${padding}`],
        hover ? styles.hover : '',
        onClick ? styles.clickable : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div className={classNames} onClick={onClick}>
            {children}
        </div>
    )
}
