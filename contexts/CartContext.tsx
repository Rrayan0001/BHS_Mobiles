'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { PurchaseMode } from '@/lib/cartRules'

export interface CartItem {
    id: string
    name: string
    variant?: string
    price: number
    quantity: number
    image?: string
    purchaseMode?: PurchaseMode
    maxQuantity?: number
}

interface AddCartItemInput extends Omit<CartItem, 'quantity'> {
    quantity?: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: AddCartItemInput) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    itemCount: number
    subtotal: number
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'bhs_mobiles_cart'

const sanitizePositiveInt = (value: unknown, fallback: number) => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return fallback
    return Math.max(1, Math.floor(parsed))
}

const inferPurchaseMode = (item: {
    purchaseMode?: PurchaseMode
    maxQuantity?: number
    quantity?: number
}): PurchaseMode => {
    if (item.purchaseMode === 'single_unit' || item.purchaseMode === 'multi_unit') {
        return item.purchaseMode
    }

    if (typeof item.maxQuantity === 'number' && item.maxQuantity > 1) {
        return 'multi_unit'
    }

    if (typeof item.quantity === 'number' && item.quantity > 1) {
        return 'multi_unit'
    }

    return 'single_unit'
}

const normalizeCartItem = (item: any): CartItem | null => {
    if (!item || typeof item.id !== 'string' || typeof item.name !== 'string') {
        return null
    }

    const purchaseMode = inferPurchaseMode(item)
    const maxQuantity =
        purchaseMode === 'single_unit'
            ? 1
            : sanitizePositiveInt(item.maxQuantity ?? item.quantity ?? 1, 1)

    const quantity =
        purchaseMode === 'single_unit'
            ? 1
            : Math.min(maxQuantity, sanitizePositiveInt(item.quantity ?? 1, 1))

    return {
        id: item.id,
        name: item.name,
        variant: item.variant || '',
        price: Number(item.price) || 0,
        image: item.image || '',
        purchaseMode,
        maxQuantity,
        quantity,
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) {
                    const normalizedItems = parsed
                        .map(normalizeCartItem)
                        .filter((item): item is CartItem => item !== null)
                    setItems(normalizedItems)
                }
            } catch (e) {
                console.error('Failed to parse cart from localStorage')
            }
        }
        setIsHydrated(true)
    }, [])

    // Persist cart to localStorage on change
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
        }
    }, [items, isHydrated])

    const addItem = (newItem: AddCartItemInput) => {
        const purchaseMode = inferPurchaseMode(newItem)
        const requestedQuantity =
            purchaseMode === 'single_unit'
                ? 1
                : sanitizePositiveInt(newItem.quantity ?? 1, 1)
        const maxQuantity =
            purchaseMode === 'single_unit'
                ? 1
                : sanitizePositiveInt(newItem.maxQuantity ?? requestedQuantity, requestedQuantity)

        if (maxQuantity < 1) return

        setItems(prevItems => {
            let nextItems = [...prevItems]

            if (purchaseMode === 'single_unit') {
                // Enforce one single-unit device in cart at a time; keep accessories intact.
                nextItems = nextItems.filter(
                    (item) => !(inferPurchaseMode(item) === 'single_unit' && item.id !== newItem.id)
                )
            }

            const existingItem = nextItems.find(item => item.id === newItem.id)
            if (existingItem) {
                const existingPurchaseMode = inferPurchaseMode(existingItem)
                const existingMaxQuantity =
                    existingPurchaseMode === 'single_unit'
                        ? 1
                        : Math.max(
                            sanitizePositiveInt(existingItem.maxQuantity ?? 1, 1),
                            maxQuantity
                        )

                const nextQuantity =
                    existingPurchaseMode === 'single_unit'
                        ? 1
                        : Math.min(existingMaxQuantity, existingItem.quantity + requestedQuantity)

                return nextItems.map(item =>
                    item.id === newItem.id
                        ? {
                            ...item,
                            name: newItem.name,
                            variant: newItem.variant || '',
                            price: newItem.price,
                            image: newItem.image || '',
                            purchaseMode: existingPurchaseMode,
                            maxQuantity: existingMaxQuantity,
                            quantity: nextQuantity
                        }
                        : item
                )
            }

            return [
                ...nextItems,
                {
                    id: newItem.id,
                    name: newItem.name,
                    variant: newItem.variant || '',
                    price: newItem.price,
                    image: newItem.image || '',
                    purchaseMode,
                    maxQuantity,
                    quantity: Math.min(maxQuantity, requestedQuantity)
                }
            ]
        })
        setIsOpen(true) // Open cart popup when item added
    }

    const removeItem = (id: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(id)
            return
        }
        setItems(prevItems => prevItems.map(item => {
            if (item.id !== id) return item

            const purchaseMode = inferPurchaseMode(item)
            const maxQuantity =
                purchaseMode === 'single_unit'
                    ? 1
                    : sanitizePositiveInt(item.maxQuantity ?? 1, 1)

            const nextQuantity =
                purchaseMode === 'single_unit'
                    ? 1
                    : Math.min(maxQuantity, sanitizePositiveInt(quantity, 1))

            return {
                ...item,
                purchaseMode,
                maxQuantity,
                quantity: nextQuantity
            }
        }))
    }

    const clearCart = () => {
        setItems([])
    }

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            itemCount,
            subtotal,
            isOpen,
            setIsOpen
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
