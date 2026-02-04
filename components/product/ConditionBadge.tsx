import React from 'react'
import Badge from '@/components/ui/Badge'
import { CONDITION_GRADES, type ConditionGradeInfo } from '@/lib/types'
import styles from './ConditionBadge.module.css'

export interface ConditionBadgeProps {
    grade: 'A' | 'B' | 'C'
    showDetails?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export default function ConditionBadge({
    grade,
    showDetails = false,
    size = 'md',
}: ConditionBadgeProps) {
    const info: ConditionGradeInfo = CONDITION_GRADES[grade]

    if (!showDetails) {
        return (
            <Badge variant={info.color as any} size={size}>
                Grade {info.grade} — {info.label}
            </Badge>
        )
    }

    return (
        <div className={styles.conditionCard}>
            <div className={styles.header}>
                <Badge variant={info.color as any} size="lg">
                    Grade {info.grade}
                </Badge>
                <span className={styles.label}>{info.label}</span>
            </div>
            <p className={styles.description}>{info.description}</p>
            <div className={styles.details}>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Battery Health:</span>
                    <span className={styles.detailValue}>{info.batteryHealth}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Warranty:</span>
                    <span className={styles.detailValue}>{info.warranty}</span>
                </div>
            </div>
        </div>
    )
}
