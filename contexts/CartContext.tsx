'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
    id: string
    name: string
    variant?: string
    price: number
    quantity: number
    image?: string
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>) => void
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

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
            try {
                setItems(JSON.parse(stored))
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

    const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === newItem.id)
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prevItems, { ...newItem, quantity: 1 }]
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
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        )
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
