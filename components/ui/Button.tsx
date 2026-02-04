import React from 'react'
import styles from './Button.module.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    loading?: boolean
    children: React.ReactNode
}

export default function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        loading ? styles.loading : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <button
            className={classNames}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className={styles.spinner} />}
            <span className={loading ? styles.hiddenText : ''}>{children}</span>
        </button>
    )
}
