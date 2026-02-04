import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Badge from '@/components/ui/Badge'
import { Product } from '@/lib/types'
import styles from './ProductCard.module.css'

export interface ProductCardProps {
    product: Product
    priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
    const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0]
    const discount = product.compare_at_price
        ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
        : 0

    const conditionColors: Record<'A' | 'B' | 'C', 'success' | 'primary' | 'warning'> = {
        A: 'success',
        B: 'primary',
        C: 'warning',
    }

    return (
        <Link href={`/product/${product.id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                {primaryImage ? (
                    <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt_text || product.title}
                        fill
                        className={styles.image}
                        priority={priority}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        <span className={styles.placeholderIcon}>📱</span>
                    </div>
                )}

                {discount > 0 && (
                    <div className={styles.discountBadge}>-{discount}%</div>
                )}

                {product.stock_quantity === 0 && (
                    <div className={styles.outOfStock}>Out of Stock</div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <Badge variant={conditionColors[product.condition_grade]} size="sm">
                        Grade {product.condition_grade}
                    </Badge>
                    {product.warranty_months > 0 && (
                        <span className={styles.warranty}>🛡️ {product.warranty_months}mo</span>
                    )}
                </div>

                <h3 className={styles.title}>{product.title}</h3>

                {product.description && (
                    <p className={styles.description}>
                        {product.description.substring(0, 80)}
                        {product.description.length > 80 ? '...' : ''}
                    </p>
                )}

                <div className={styles.footer}>
                    <div className={styles.pricing}>
                        <span className={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
                        {product.compare_at_price && (
                            <span className={styles.comparePrice}>
                                ₹{product.compare_at_price.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>

                    {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                        <span className={styles.lowStock}>Only {product.stock_quantity} left</span>
                    )}
                </div>
            </div>
        </Link>
    )
}
