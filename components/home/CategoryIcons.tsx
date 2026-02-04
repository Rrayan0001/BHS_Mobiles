'use client'

import React from 'react'
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
    Check: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
            <polyline points="20 6 9 17 4 12"></polyline>
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

export default function CategoryIcons() {
    const categories = [
        { name: 'iPhone', icon: Icons.iPhone, slug: '/category/iphone' },
        { name: 'Watch', icon: Icons.Watch, slug: '/category/iwatch' },
        { name: 'Airpods', icon: Icons.Airpods, slug: '/category/airpods' },
        { name: 'Samsung', icon: Icons.Samsung, slug: '/category/android' },
        { name: 'Google Pixel', icon: Icons.Pixel, slug: '/category/android' },
        { name: 'Used Phones', icon: Icons.Check, slug: '/products', special: true },
        { name: 'Covers', icon: Icons.Cover, slug: '/category/accessories' },
        { name: 'Watch Straps', icon: Icons.Strap, slug: '/category/accessories' },
        { name: 'Chargers', icon: Icons.Charger, slug: '/category/accessories' },
    ]

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    {categories.map((cat) => (
                        <Link key={cat.name} href={cat.slug} className={styles.card}>
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
