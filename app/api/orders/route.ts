import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { resolvePurchaseMode } from '@/lib/cartRules'

interface CheckoutAddress {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
}

const CHECKOUT_DEFAULT_ADDRESS_ID = 'checkout-default-address'

// Generate unique order number
function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `ORD-${timestamp}${random}`
}

function readText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : ''
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

function normalizeCheckoutAddress(input: unknown): CheckoutAddress {
    const source = isRecord(input) ? input : {}

    return {
        fullName: readText(source.fullName) || readText(source.name),
        phone: readText(source.phone),
        address: readText(source.address) || readText(source.line1),
        city: readText(source.city),
        state: readText(source.state),
        pincode: readText(source.pincode),
    }
}

function toStoredAddress(address: CheckoutAddress): Record<string, string | boolean> {
    return {
        id: CHECKOUT_DEFAULT_ADDRESS_ID,
        name: address.fullName,
        fullName: address.fullName,
        phone: address.phone,
        line1: address.address,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        is_default: true
    }
}

async function persistUserCheckoutAddress(userId: string, userEmail: string, input: unknown) {
    const address = normalizeCheckoutAddress(input)
    const hasCompleteAddress = Object.values(address).every((value) => value.length > 0)

    if (!hasCompleteAddress) {
        return
    }

    const { data: existingUser, error: existingUserError } = await supabaseAdmin
        .from('users')
        .select('addresses')
        .eq('email', userEmail)
        .maybeSingle()

    if (existingUserError) {
        console.error('Saved address fetch error:', existingUserError)
        return
    }

    const existingAddresses = Array.isArray(existingUser?.addresses)
        ? existingUser.addresses.filter(isRecord)
        : []

    const mergedAddresses = [
        toStoredAddress(address),
        ...existingAddresses
            .filter((existingAddress) => readText(existingAddress.id) !== CHECKOUT_DEFAULT_ADDRESS_ID)
            .map((existingAddress) => ({ ...existingAddress, is_default: false }))
    ]

    const { error: upsertError } = await supabaseAdmin
        .from('users')
        .upsert({
            id: userId,
            email: userEmail,
            name: address.fullName,
            phone: address.phone,
            addresses: mergedAddresses
        }, { onConflict: 'email' })

    if (upsertError) {
        console.error('Saved address upsert error:', upsertError)
    }
}

// GET - Fetch user's orders or specific order
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const url = new URL(request.url)
        const orderNumber = url.searchParams.get('order_number')

        const baseQuery = supabaseAdmin
            .from('orders')
            .select(`
                id,
                order_number,
                status,
                subtotal,
                tax,
                shipping,
                total,
                payment_method,
                payment_status,
                shipping_address,
                created_at,
                order_items (
                    id,
                    product_id,
                    product_title,
                    product_sku,
                    price,
                    quantity,
                    subtotal
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (orderNumber) {
            const { data: order, error } = await baseQuery
                .eq('order_number', orderNumber)
                .single()

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ orders: order }, { status: 200 })
        }

        const { data: orders, error } = await baseQuery

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ orders }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create new order
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { shipping_address, billing_address, payment_method, items } = body

        // Validate shipping address fields
        if (!shipping_address) {
            return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 })
        }

        const requiredFields = ['fullName', 'phone', 'address', 'city', 'state', 'pincode']
        for (const field of requiredFields) {
            if (!shipping_address[field] || shipping_address[field].trim() === '') {
                return NextResponse.json({
                    error: `Shipping ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`
                }, { status: 400 })
            }
        }

        // Validate phone number (Indian format: 10 digits)
        const phoneClean = shipping_address.phone.replace(/[^0-9]/g, '')
        if (phoneClean.length < 10) {
            return NextResponse.json({ error: 'Please enter a valid 10-digit phone number' }, { status: 400 })
        }

        // Validate pincode (Indian format: 6 digits)
        const pincodeClean = shipping_address.pincode.replace(/[^0-9]/g, '')
        if (pincodeClean.length !== 6) {
            return NextResponse.json({ error: 'Please enter a valid 6-digit pincode' }, { status: 400 })
        }

        // Validate payment method
        if (!payment_method || !['cod', 'online'].includes(payment_method)) {
            return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
        }

        // Validate cart items (sent from frontend localStorage cart)
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
        }

        // Normalize cart items by product (prevents duplicate product lines bypassing rules)
        const normalizedItemsMap = new Map<string, {
            id: string
            name: string
            variant: string | null
            price: number
            quantity: number
        }>()

        for (const item of items) {
            if (!item?.id || typeof item.id !== 'string') {
                return NextResponse.json({ error: 'Invalid cart item: missing product ID' }, { status: 400 })
            }

            const quantity = Number(item.quantity)
            if (!Number.isFinite(quantity) || quantity < 1) {
                return NextResponse.json({
                    error: `Invalid quantity for product ${item.name || item.id}`
                }, { status: 400 })
            }

            const price = Number(item.price)
            if (!Number.isFinite(price) || price < 0) {
                return NextResponse.json({
                    error: `Invalid price for product ${item.name || item.id}`
                }, { status: 400 })
            }

            const safeQuantity = Math.floor(quantity)

            const existing = normalizedItemsMap.get(item.id)
            if (existing) {
                existing.quantity += safeQuantity
                continue
            }

            normalizedItemsMap.set(item.id, {
                id: item.id,
                name: item.name || 'Unknown Product',
                variant: item.variant || null,
                price,
                quantity: safeQuantity
            })
        }

        const normalizedItems = Array.from(normalizedItemsMap.values())

        // --- STOCK + PURCHASE RULE VALIDATION ---
        const productIds = normalizedItems.map((item) => item.id)
        const { data: products, error: stockCheckError } = await supabaseAdmin
            .from('products')
            .select(`
                id,
                title,
                stock,
                purchase_mode,
                is_single_unit,
                category:categories(slug, name, display_name)
            `)
            .in('id', productIds)

        if (stockCheckError) {
            console.error('Stock check error:', stockCheckError)
            return NextResponse.json({ error: 'Failed to validate stock' }, { status: 500 })
        }

        // Build a map of product stock + purchase rules for quick lookup
        const stockMap = new Map<string, {
            title: string
            stock: number
            purchase_mode?: string | null
            is_single_unit?: boolean | null
            category?: { slug?: string | null; name?: string | null; display_name?: string | null } | null
        }>()
        for (const p of products || []) {
            const category =
                Array.isArray(p.category) ? p.category[0] : p.category

            stockMap.set(p.id, {
                title: p.title,
                stock: p.stock ?? 0,
                purchase_mode: p.purchase_mode ?? null,
                is_single_unit: p.is_single_unit ?? null,
                category: category || null
            })
        }

        // Check each cart item against available stock + single/multi-unit rules
        const outOfStockItems: string[] = []
        const ruleViolations: string[] = []
        const singleUnitProducts: string[] = []

        for (const item of normalizedItems) {
            const product = stockMap.get(item.id)
            if (!product) {
                outOfStockItems.push(`${item.name || 'Unknown product'} (not found)`)
                continue
            }

            if (product.stock < item.quantity) {
                outOfStockItems.push(
                    `${product.title} (requested: ${item.quantity}, available: ${product.stock})`
                )
                continue
            }

            const purchaseMode = resolvePurchaseMode(product)
            if (purchaseMode === 'single_unit') {
                singleUnitProducts.push(product.title)
                if (item.quantity !== 1) {
                    ruleViolations.push(`${product.title} supports quantity 1 only`)
                }
            }
        }

        if (outOfStockItems.length > 0) {
            return NextResponse.json({
                error: `Insufficient stock for: ${outOfStockItems.join(', ')}`
            }, { status: 400 })
        }

        if (singleUnitProducts.length > 1) {
            return NextResponse.json({
                error: 'Only one single-unit device can be ordered at a time. Remove extra devices and try again.'
            }, { status: 400 })
        }

        if (ruleViolations.length > 0) {
            return NextResponse.json({
                error: `Cart rule violation: ${ruleViolations.join(', ')}`
            }, { status: 400 })
        }
        // --- END STOCK + PURCHASE RULE VALIDATION ---

        // Calculate totals from the items sent by client
        const subtotal = normalizedItems.reduce((sum: number, item) => sum + (item.price * item.quantity), 0)
        const shipping = subtotal >= 50000 ? 0 : 200
        const tax = Math.round(subtotal * 0.18)
        const total = subtotal + shipping + tax

        // Create order
        const orderNumber = generateOrderNumber()

        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                user_id: user.id,
                email: user.email || '',
                order_number: orderNumber,
                status: 'pending',
                subtotal,
                tax,
                shipping,
                total,
                shipping_address,
                billing_address: billing_address || shipping_address,
                payment_method,
                payment_status: 'pending'
            })
            .select()
            .single()

        if (orderError) {
            console.error('Order creation error:', orderError)
            return NextResponse.json({ error: orderError.message }, { status: 500 })
        }

        // Create order items from normalized cart items
        const orderItems = normalizedItems.map((item) => ({
            order_id: order.id,
            product_id: item.id,
            product_title: item.name || 'Unknown Product',
            product_sku: item.variant || null,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        }))

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItems)

        if (itemsError) {
            console.error('Order items error:', itemsError)
            // Rollback order if items fail
            await supabaseAdmin.from('orders').delete().eq('id', order.id)
            return NextResponse.json({ error: itemsError.message }, { status: 500 })
        }

        // --- DECREMENT STOCK ---
        for (const item of normalizedItems) {
            const product = stockMap.get(item.id)
            if (product) {
                const newStock = product.stock - item.quantity
                await supabaseAdmin
                    .from('products')
                    .update({ stock: Math.max(0, newStock) })
                    .eq('id', item.id)
            }
        }
        // --- END DECREMENT STOCK ---

        if (user.email) {
            await persistUserCheckoutAddress(user.id, user.email, shipping_address)
        }

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                order_number: orderNumber,
                total
            }
        }, { status: 201 })
    } catch (error) {
        console.error('Order creation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
