'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import styles from './Header.module.css'

interface CategoryNavItem {
    id: string
    name: string
    slug: string
    display_name?: string | null
}

interface NavItem {
    name: string
    href: string
    activePrefixes?: string[]
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
    { name: 'All Products', href: '/products', activePrefixes: ['/product'] },
    { name: 'iPhone', href: '/shop/category/iphone', activePrefixes: ['/category/iphone'] },
    { name: 'iWatch', href: '/shop/category/iwatch', activePrefixes: ['/category/iwatch'] },
    { name: 'AirPods', href: '/shop/category/airpods', activePrefixes: ['/category/airpods'] },
    { name: 'Android', href: '/shop/category/android', activePrefixes: ['/category/android'] },
    { name: 'Accessories', href: '/shop/category/accessories', activePrefixes: ['/category/accessories'] },
]

const CATEGORY_NAV_LIMIT = 5

const normalizePath = (value: string) => {
    const path = value.split('?')[0].split('#')[0]

    if (!path) return '/'
    if (path === '/') return '/'
    return path.endsWith('/') ? path.slice(0, -1) : path
}

const toDisplayLabel = (input: string) => {
    return input
        .trim()
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\b\w/g, (match) => match.toUpperCase())
}

export default function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [mobileSearchQuery, setMobileSearchQuery] = useState('')
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV_ITEMS)
    const cartRef = useRef<HTMLDivElement>(null)
    const userMenuRef = useRef<HTMLDivElement>(null)

    // Use cart context
    const { items, removeItem, itemCount, subtotal, isOpen, setIsOpen } = useCart()

    // Use auth context
    const { user, isAuthenticated, signOut, loading } = useAuth()

    useEffect(() => {
        let ignore = false
        const controller = new AbortController()

        const loadNavCategories = async () => {
            try {
                const response = await fetch(`/api/categories?limit=${CATEGORY_NAV_LIMIT}`, {
                    signal: controller.signal,
                    cache: 'no-store',
                })

                if (!response.ok) {
                    return
                }

                const data: { categories?: CategoryNavItem[] } = await response.json()
                const categories = Array.isArray(data.categories) ? data.categories : []

                if (!categories.length || ignore) {
                    return
                }

                const categoryNavItems: NavItem[] = categories
                    .filter((category) => typeof category.slug === 'string' && category.slug.trim().length > 0)
                    .map((category) => {
                        const slug = category.slug.trim()
                        const displayName = category.display_name?.trim()
                        const fallbackLabel = category.name?.trim() || slug

                        return {
                            name: displayName || toDisplayLabel(fallbackLabel),
                            href: `/shop/category/${slug}`,
                            activePrefixes: [`/category/${slug}`],
                        }
                    })
                    .slice(0, CATEGORY_NAV_LIMIT)

                if (!categoryNavItems.length || ignore) {
                    return
                }

                setNavItems([DEFAULT_NAV_ITEMS[0], ...categoryNavItems])
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return
                }
                console.error('Failed to load navbar categories:', error)
            }
        }

        loadNavCategories()

        return () => {
            ignore = true
            controller.abort()
        }
    }, [])

    // Close cart when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [setIsOpen])

    // Prevent background scroll when mobile menu is open
    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = previousOverflow || ''
        }

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [mobileMenuOpen])

    const handleSignOut = async () => {
        await signOut()
        setIsUserMenuOpen(false)
        setMobileMenuOpen(false)
    }

    const currentPath = normalizePath(pathname || '/')

    const isNavItemActive = (item: NavItem) => {
        const targets = [item.href, ...(item.activePrefixes || [])]

        return targets.some((target) => {
            const normalizedTarget = normalizePath(target)

            if (normalizedTarget === '/') {
                return currentPath === '/'
            }

            return currentPath === normalizedTarget || currentPath.startsWith(`${normalizedTarget}/`)
        })
    }

    const executeSearch = (value: string, closeMobileMenu = false) => {
        const query = value.trim()
        const target = query ? `/products?search=${encodeURIComponent(query)}` : '/products'

        router.push(target)
        setIsSearchOpen(false)

        if (closeMobileMenu) {
            setMobileMenuOpen(false)
        }
    }

    const handleDesktopSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        executeSearch(searchQuery)
    }

    const handleMobileSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        executeSearch(mobileSearchQuery, true)
    }

    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.mainBarContent}>
                    {/* Left: Logo */}
                    <Link href="/" className={styles.logo}>
                        <div className={styles.logoWrapper}>
                            <Image
                                src="/images/logo.png"
                                alt="BHS Mobiles"
                                fill
                                sizes="(max-width: 768px) 100vw, 150px"
                                className={styles.logoImage}
                                priority
                                unoptimized
                            />
                        </div>
                    </Link>

                    {/* Center: Navigation */}
                    <nav className={styles.centerNav}>
                        {navItems.map((item) => {
                            const isActive = isNavItemActive(item)

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Right: Actions (Search, Cart, Account) */}
                    <div className={styles.rightActions}>
                        {/* Search Trigger */}
                        <button
                            type="button"
                            className={`${styles.iconButton} ${styles.searchDesktopAction} ${isSearchOpen ? styles.iconButtonActive : ''}`}
                            onClick={() => {
                                if (!isSearchOpen) {
                                    setIsSearchOpen(true)
                                    return
                                }

                                if (searchQuery.trim()) {
                                    executeSearch(searchQuery)
                                    return
                                }

                                setIsSearchOpen(false)
                            }}
                            aria-expanded={isSearchOpen}
                            aria-label="Search"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>

                        {/* Cart with Popup */}
                        <div className={styles.cartContainer} ref={cartRef}>
                            <button
                                type="button"
                                className={`${styles.iconButton} ${isOpen ? styles.iconButtonActive : ''}`}
                                onClick={() => setIsOpen(!isOpen)}
                                aria-expanded={isOpen}
                                aria-label="Cart"
                            >
                                <div className={styles.cartIconWrapper}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                                    </svg>
                                    {itemCount > 0 && (
                                        <span className={styles.cartCount}>{itemCount}</span>
                                    )}
                                </div>
                            </button>

                            {/* Cart Popup */}
                            {isOpen && (
                                <div className={styles.cartPopup}>
                                    {items.length === 0 ? (
                                        <div className={styles.emptyCartPopup}>
                                            <p>Your cart is empty</p>
                                            <Link href="/products" className={styles.shopLink} onClick={() => setIsOpen(false)}>
                                                Start Shopping
                                            </Link>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={styles.cartItems}>
                                                {items.map((item) => (
                                                    <div key={item.id} className={styles.cartItem}>
                                                        <button
                                                            className={styles.removeBtn}
                                                            onClick={() => removeItem(item.id)}
                                                        >
                                                            ×
                                                        </button>
                                                        <div className={styles.cartItemImage}>
                                                            {item.image ? (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                                                />
                                                            ) : (
                                                                <span>📱</span>
                                                            )}
                                                        </div>
                                                        <div className={styles.cartItemInfo}>
                                                            <div className={styles.cartItemName}>{item.name}</div>
                                                            <div className={styles.cartItemVariant}>{item.variant}</div>
                                                        </div>
                                                        <div className={styles.cartItemRight}>
                                                            <div className={styles.cartItemPrice}>Rs. {item.price.toLocaleString()}</div>
                                                            <div className={styles.cartItemQty}>{item.quantity} Units</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className={styles.cartSubtotal}>
                                                <span>Subtotal</span>
                                                <span>Rs. {subtotal.toLocaleString()}</span>
                                            </div>
                                            <Link href="/checkout" className={styles.checkoutBtn} onClick={() => setIsOpen(false)}>
                                                CHECKOUT
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 16 16 12 12 8"></polyline>
                                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                                </svg>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User Account with Dropdown */}
                        <div className={`${styles.userContainer} ${styles.accountDesktopAction}`} ref={userMenuRef}>
                            <button
                                type="button"
                                className={`${styles.iconButton} ${isUserMenuOpen ? styles.iconButtonActive : ''}`}
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                aria-expanded={isUserMenuOpen}
                                aria-label="Account"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </button>

                            {isUserMenuOpen && (
                                <div className={styles.userMenu}>
                                    {!loading && isAuthenticated ? (
                                        <>
                                            <div className={styles.userGreeting}>
                                                Hi, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                                            </div>
                                            <Link href="/account" className={styles.userMenuItem} onClick={() => setIsUserMenuOpen(false)}>
                                                My Account
                                            </Link>
                                            <Link href="/account/orders" className={styles.userMenuItem} onClick={() => setIsUserMenuOpen(false)}>
                                                My Orders
                                            </Link>
                                            <button type="button" className={styles.userMenuLogout} onClick={handleSignOut}>
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/auth/login" className={styles.userMenuSignIn} onClick={() => setIsUserMenuOpen(false)}>
                                                Sign In
                                            </Link>
                                            <Link href="/auth/register" className={styles.userMenuRegister} onClick={() => setIsUserMenuOpen(false)}>
                                                Create Account
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            type="button"
                            className={`${styles.mobileToggle} ${mobileMenuOpen ? styles.mobileToggleActive : ''}`}
                            aria-expanded={mobileMenuOpen}
                            aria-label="Toggle menu"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Search Overlay */}
                {isSearchOpen && (
                    <div className={styles.searchBarContainer}>
                        <form className={styles.searchWrapper} onSubmit={handleDesktopSearchSubmit}>
                            <input
                                type="text"
                                placeholder="Search..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                autoFocus
                            />
                        </form>
                    </div>
                )}
            </div>

            {mobileMenuOpen && (
                <div className={styles.mobileMenuOverlay} onClick={() => setMobileMenuOpen(false)}>
                    <div
                        className={styles.mobileMenu}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Browse menu"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.mobileMenuHeader}>
                            <div>
                                <div className={styles.mobileMenuTitle}>Browse</div>
                                <div className={styles.mobileMenuSubtitle}>Quick access to every category</div>
                            </div>
                            <button
                                type="button"
                                className={styles.mobileClose}
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                ×
                            </button>
                        </div>

                        <form className={styles.mobileSearch} onSubmit={handleMobileSearchSubmit}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search phones, watches, accessories"
                                value={mobileSearchQuery}
                                onChange={(event) => setMobileSearchQuery(event.target.value)}
                            />
                        </form>

                        <div className={styles.mobileNavList}>
                            {navItems.map((item) => {
                                const isActive = isNavItemActive(item)

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}
                                        aria-current={isActive ? 'page' : undefined}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span>{item.name}</span>
                                        <span className={styles.mobileNavArrow}>→</span>
                                    </Link>
                                )
                            })}
                        </div>

                        <div className={styles.mobileActions}>
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/account"
                                        className={styles.mobileActionPrimary}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Account
                                    </Link>
                                    <button
                                        type="button"
                                        className={styles.mobileActionGhost}
                                        onClick={handleSignOut}
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className={styles.mobileActionPrimary}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className={styles.mobileActionGhost}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Create Account
                                    </Link>
                                </>
                            )}

                            <Link
                                href="/cart"
                                className={styles.mobileActionGhost}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Cart ({itemCount} items)
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
