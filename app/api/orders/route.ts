import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Generate unique order number
function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `ORD-${timestamp}${random}`
}

// GET - Fetch user's orders
export async function GET() {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                id,
                order_number,
                status,
                subtotal,
                tax,
                shipping,
                total,
                payment_status,
                created_at,
                order_items (
                    id,
                    quantity,
                    unit_price,
                    product_snapshot
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ orders }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create new order from cart
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { shipping_address, billing_address, payment_method } = body

        if (!shipping_address || !billing_address) {
            return NextResponse.json({ error: 'Shipping and billing addresses required' }, { status: 400 })
        }

        // Get cart items
        const { data: cartItems, error: cartError } = await supabase
            .from('cart_items')
            .select(`
                id,
                quantity,
                price_snapshot,
                product_id,
                products (
                    id,
                    title,
                    sku,
                    condition_grade,
                    warranty_months,
                    product_images (url, is_primary)
                )
            `)
            .eq('user_id', user.id)

        if (cartError) {
            return NextResponse.json({ error: cartError.message }, { status: 500 })
        }

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
        }

        // Calculate totals
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price_snapshot * item.quantity), 0)
        const shipping = subtotal >= 50000 ? 0 : 200
        const tax = 0 // Can add GST calculation here
        const total = subtotal + shipping + tax

        // Create order
        const orderNumber = generateOrderNumber()

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                order_number: orderNumber,
                status: 'pending',
                subtotal,
                tax,
                shipping,
                total,
                shipping_address,
                billing_address,
                payment_method,
                payment_status: 'pending'
            })
            .select()
            .single()

        if (orderError) {
            return NextResponse.json({ error: orderError.message }, { status: 500 })
        }

        // Create order items
        const orderItems = cartItems.map(item => {
            // products could be an array or object depending on Supabase query
            const product = Array.isArray(item.products) ? item.products[0] : item.products
            return {
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.price_snapshot,
                product_snapshot: {
                    title: product?.title,
                    sku: product?.sku,
                    condition_grade: product?.condition_grade,
                    warranty_months: product?.warranty_months,
                    images: product?.product_images
                }
            }
        })

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)

        if (itemsError) {
            // Rollback order if items fail
            await supabase.from('orders').delete().eq('id', order.id)
            return NextResponse.json({ error: itemsError.message }, { status: 500 })
        }

        // Clear cart
        await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)

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
