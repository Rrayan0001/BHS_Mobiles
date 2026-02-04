'use client'

import React, { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'
import Button from '@/components/ui/Button'
import styles from './page.module.css'

export default function CategoryPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const slug = params.slug as string

    const [filtersOpen, setFiltersOpen] = useState(false)
    const [sortBy, setSortBy] = useState('newest')

    // Mock data - will be replaced with Supabase query
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)
    const products: any[] = [] // Empty for now

    const filters = {
        brands: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme'],
        conditions: [
            { value: 'A', label: 'Grade A - Like New' },
            { value: 'B', label: 'Grade B - Good' },
            { value: 'C', label: 'Grade C - Fair' },
        ],
        priceRanges: [
            { label: 'Under ₹10,000', min: 0, max: 10000 },
            { label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
            { label: '₹20,000 - ₹30,000', min: 20000, max: 30000 },
            { label: 'Above ₹30,000', min: 30000, max: 999999 },
        ],
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className="container">
                    <div className={styles.headerContent}>
                        <div>
                            <h1 className={styles.title}>{categoryName}</h1>
                            <p className={styles.subtitle}>
                                Certified refurbished devices with warranty
                            </p>
                        </div>
                        <div className={styles.headerActions}>
                            <button
                                className={styles.filterToggle}
                                onClick={() => setFiltersOpen(!filtersOpen)}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path
                                        d="M2 4h16M5 10h10M8 16h4"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className={styles.layout}>
                    <aside className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ''}`}>
                        <div className={styles.sidebarHeader}>
                            <h3>Filters</h3>
                            <button
                                className={styles.closeSidebar}
                                onClick={() => setFiltersOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.filterSection}>
                            <h4 className={styles.filterHeading}>Condition</h4>
                            <div className={styles.filterOptions}>
                                {filters.conditions.map((condition) => (
                                    <label key={condition.value} className={styles.checkbox}>
                                        <input type="checkbox" />
                                        <span>{condition.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles.filterSection}>
                            <h4 className={styles.filterHeading}>Brand</h4>
                            <div className={styles.filterOptions}>
                                {filters.brands.map((brand) => (
                                    <label key={brand} className={styles.checkbox}>
                                        <input type="checkbox" />
                                        <span>{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles.filterSection}>
                            <h4 className={styles.filterHeading}>Price Range</h4>
                            <div className={styles.filterOptions}>
                                {filters.priceRanges.map((range) => (
                                    <label key={range.label} className={styles.checkbox}>
                                        <input type="checkbox" />
                                        <span>{range.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles.filterActions}>
                            <Button variant="outline" size="sm" fullWidth>
                                Clear All
                            </Button>
                        </div>
                    </aside>

                    <main className={styles.main}>
                        <div className={styles.toolbar}>
                            <p className={styles.resultCount}>
                                {products.length} products found
                            </p>
                            <div className={styles.sortWrapper}>
                                <label htmlFor="sort" className={styles.sortLabel}>
                                    Sort by:
                                </label>
                                <select
                                    id="sort"
                                    className={styles.sortSelect}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="popular">Most Popular</option>
                                </select>
                            </div>
                        </div>

                        {products.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📦</div>
                                <h3>No products found</h3>
                                <p>
                                    We're currently updating our inventory. Check back soon or browse other
                                    categories.
                                </p>
                                <Button variant="primary">Browse All Products</Button>
                            </div>
                        ) : (
                            <div className={styles.productGrid}>
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
