'use client'

import Link from 'next/link'
import styles from './layout.module.css'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const navItems = [

        {
            label: 'Dashboard', href: '/admin', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="9"></rect>
                    <rect x="14" y="3" width="7" height="5"></rect>
                    <rect x="14" y="12" width="7" height="9"></rect>
                    <rect x="3" y="16" width="7" height="5"></rect>
                </svg>
            )
        },
        {
            label: 'Products', href: '/admin/products', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 2 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
            )
        },
        {
            label: 'Categories', href: '/admin/categories', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
            )
        },
        {
            label: 'Banners', href: '/admin/banners', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                    <polyline points="17 2 12 7 7 2"></polyline>
                </svg>
            )
        },
        {
            label: 'Reviews', href: '/admin/reviews', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            )
        },
        {
            label: 'Orders', href: '/admin/orders', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            )
        },
    ]

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link href="/admin" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="18" height="18" rx="2" fill="url(#gradient)" />
                                <path d="M8 8h8M8 12h8M8 16h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="gradient" x1="3" y1="3" x2="21" y2="21">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className={styles.logoText}>
                            <span className={styles.brandName}>BHS Mobiles</span>
                            <span className={styles.adminBadge}>Admin</span>
                        </div>
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <div className={styles.navSection}>
                        <span className={styles.navLabel}>Main</span>
                        {navItems.slice(0, 3).map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={styles.navItem}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                <span className={styles.navText}>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className={styles.navSection}>
                        <span className={styles.navLabel}>Content</span>
                        {navItems.slice(3, 5).map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={styles.navItem}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                <span className={styles.navText}>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className={styles.navSection}>
                        <span className={styles.navLabel}>Sales</span>
                        {navItems.slice(5).map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={styles.navItem}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                <span className={styles.navText}>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userProfile}>
                        <div className={styles.userAvatar}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>Admin User</span>
                            <span className={styles.userRole}>Administrator</span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className={styles.main}>
                <div className={styles.mainContent}>
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className={styles.bottomNav}>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={styles.bottomNavItem}
                    >
                        <span className={styles.bottomNavIcon}>{item.icon}</span>
                        <span className={styles.bottomNavLabel}>{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
