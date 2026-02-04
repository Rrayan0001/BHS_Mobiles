'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import styles from './Header.module.css'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const cartRef = useRef<HTMLDivElement>(null)
    const userMenuRef = useRef<HTMLDivElement>(null)

    // Use cart context
    const { items, removeItem, itemCount, subtotal, isOpen, setIsOpen } = useCart()

    // Use auth context
    const { user, isAuthenticated, signOut, loading } = useAuth()

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

    const handleSignOut = async () => {
        await signOut()
        setIsUserMenuOpen(false)
    }

    const navItems: { name: string; href: string; special?: boolean }[] = [
        { name: 'All Products', href: '/products' },
        { name: 'iPhone', href: '/category/iphone' },
        { name: 'iWatch', href: '/category/iwatch' },
        { name: 'Airpods', href: '/category/airpods' },
        { name: 'Android', href: '/category/android' },
        { name: 'Accessories', href: '/category/accessories' },
    ]

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
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`${styles.navLink} ${item.special ? styles.specialLink : ''}`}
                            >
                                {item.special && <span className={styles.specialBadge}>GREAT DEALS</span>}
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Actions (Search, Cart, Account) */}
                    <div className={styles.rightActions}>
                        {/* Search Trigger */}
                        <button
                            className={styles.iconButton}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
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
                                className={styles.iconButton}
                                onClick={() => setIsOpen(!isOpen)}
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
                                                            <span>{item.image || '📱'}</span>
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
                        <div className={styles.userContainer} ref={userMenuRef}>
                            <button
                                className={styles.iconButton}
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
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
                                            <button className={styles.userMenuLogout} onClick={handleSignOut}>
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/auth/login" className={styles.userMenuItem} onClick={() => setIsUserMenuOpen(false)}>
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
                            className={styles.mobileToggle}
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
                        <div className={styles.searchWrapper}>
                            <input
                                type="text"
                                placeholder="Search..."
                                className={styles.searchInput}
                                autoFocus
                            />
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
