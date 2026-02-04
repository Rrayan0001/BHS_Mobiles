import Link from 'next/link'
import styles from './layout.module.css'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: '📊' },
        { label: 'Products', href: '/admin/products', icon: '📦' },
        { label: 'Orders', href: '/admin/orders', icon: '🛍️' },
        { label: 'Inquiries', href: '/admin/inquiries', icon: '💬' },
        { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
    ]

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>📱</span>
                    <span className={styles.logoText}>NM Admin</span>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={styles.navItem}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.logoutWrapper}>
                    <button className={styles.logoutButton}>
                        <span className={styles.navIcon}>🚪</span>
                        Log Out
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}
