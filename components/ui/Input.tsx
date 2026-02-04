import React from 'react'
import styles from './Input.module.css'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    fullWidth?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

export default function Input({
    label,
    error,
    helperText,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}: InputProps) {
    const inputClasses = [
        styles.input,
        leftIcon ? styles.hasLeftIcon : '',
        rightIcon ? styles.hasRightIcon : '',
        error ? styles.error : '',
        fullWidth ? styles.fullWidth : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div className={fullWidth ? styles.fullWidth : ''}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.inputWrapper}>
                {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
                <input className={inputClasses} {...props} />
                {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
            {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
        </div>
    )
}
