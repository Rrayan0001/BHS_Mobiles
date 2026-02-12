'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import styles from './CategoryIcons.module.css'

// Professional SVG Icons
const Icons = {
    iPhone: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12" y2="18"></line>
        </svg>
    ),
    Watch: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
            <rect x="5" y="7" width="14" height="10" rx="2"></rect>
            <path d="M12 2v5"></path>
            <path d="M12 17v5"></path>
        </svg>
    ),
    Airpods: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
            <path d="M6 9a3 3 0 0 1 3-3h.5v5a3 3 0 0 1-3 3H6a1 1 0 0 1-1-1V9zm11 0a3 3 0 0 0-3-3h-.5v5a3 3 0 0 0 3 3h.5a1 1 0 0 0 1-1V9z"></path>
            <path d="M9.5 6v13a2 2 0 0 1-2 2H6m8.5-15v13a2 2 0 0 0 2 2h1.5"></path>
        </svg>
    ),
    Samsung: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12" y2="18.01"></line>
        </svg>
    ),
    Pixel: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="6" x2="12" y2="6"></line>
        </svg>
    ),
    BoxPiece: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
            <path d="M12 2L3 7l9 5 9-5-9-5z"></path>
            <path d="M3 7v10l9 5 9-5V7"></path>
            <path d="M12 12v10"></path>
        </svg>
    ),
    Cover: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
    ),
    Strap: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
            <path d="M12 2v20"></path>
            <path d="M8 5h8"></path>
            <path d="M8 19h8"></path>
            <rect x="9" y="9" width="6" height="6" rx="1"></rect>
        </svg>
    ),
    Charger: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
            <rect x="6" y="7" width="12" height="13" rx="2"></rect>
            <path d="M11 2v5"></path>
            <path d="M13 2v5"></path>
            <path d="M12 12v3"></path>
        </svg>
    )
}

interface CategoryRecord {
    id: string
    name: string
    slug: string
    display_name?: string | null
}

interface CategoryIconItem {
    name: string
    icon: React.ReactNode
    special?: boolean
    matchKeys: string[]
}

const normalizeKey = (value: string) => value.trim().toLowerCase()

export default function CategoryIcons() {
    const [dbCategories, setDbCategories] = useState<CategoryRecord[]>([])

    useEffect(() => {
        let ignore = false
        const controller = new AbortController()

        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories?limit=100', {
                    signal: controller.signal,
                    cache: 'no-store',
                })

                if (!response.ok) return

                const data: { categories?: CategoryRecord[] } = await response.json()
                if (ignore) return

                setDbCategories(Array.isArray(data.categories) ? data.categories : [])
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') return
                console.error('Failed to load category icons routing data:', error)
            }
        }

        fetchCategories()

        return () => {
            ignore = true
            controller.abort()
        }
    }, [])

    const icons: CategoryIconItem[] = [
        { name: 'iPhone', icon: Icons.iPhone, matchKeys: ['iphone', 'phones', 'smartphones'] },
        { name: 'Apple Watch', icon: Icons.Watch, matchKeys: ['iwatch', 'watch', 'watches', 'wearables'] },
        { name: 'AirPods', icon: Icons.Airpods, matchKeys: ['airpods', 'earbuds', 'wearables'] },
        { name: 'Android', icon: Icons.Samsung, matchKeys: ['android', 'phones', 'smartphones'] },
        { name: 'Google Pixel', icon: Icons.Pixel, matchKeys: ['android', 'google-pixel', 'smartphones'] },
        { name: 'Box piece', icon: Icons.BoxPiece, special: true, matchKeys: [] },
        { name: 'Covers', icon: Icons.Cover, matchKeys: ['covers', 'cover', 'accessories', 'back-skins'] },
        { name: 'Chargers', icon: Icons.Charger, matchKeys: ['chargers', 'accessories'] },
    ]

    const categoryLookup = useMemo(() => {
        const lookup = new Map<string, string>()

        for (const category of dbCategories) {
            const slugKey = normalizeKey(category.slug)
            const nameKey = normalizeKey(category.name)

            lookup.set(slugKey, category.slug)
            lookup.set(nameKey, category.slug)
        }

        return lookup
    }, [dbCategories])

    const resolveHref = (item: CategoryIconItem) => {
        for (const key of item.matchKeys) {
            const slug = categoryLookup.get(normalizeKey(key))
            if (slug) {
                return `/shop/category/${slug}`
            }
        }

        return '/products'
    }

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Shop by Category</h2>
                    <Link href="/products" className={styles.viewAll}>
                        View all products
                    </Link>
                </div>
                <div className={styles.grid}>
                    {icons.map((cat) => (
                        <Link key={cat.name} href={resolveHref(cat)} className={styles.card}>
                            <div className={`${styles.iconCircle} ${cat.special ? styles.specialCircle : ''}`}>
                                <span className={styles.icon}>{cat.icon}</span>
                            </div>
                            <span className={styles.label}>{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
