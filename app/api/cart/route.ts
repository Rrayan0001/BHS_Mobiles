import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch user's cart items
export async function GET() {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ items: [] }, { status: 200 })
        }

        const { data: cartItems, error } = await supabase
            .from('cart_items')
            .select(`
                id,
                quantity,
                price_snapshot,
                product_id,
                products (
                    id,
                    title,
                    price,
                    condition_grade,
                    product_images (url, is_primary)
                )
            `)
            .eq('user_id', user.id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ items: cartItems }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { product_id, quantity = 1 } = body

        if (!product_id) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
        }

        // Get product price
        const { data: product } = await supabase
            .from('products')
            .select('price')
            .eq('id', product_id)
            .single()

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Upsert cart item (insert or update quantity)
        const { data, error } = await supabase
            .from('cart_items')
            .upsert({
                user_id: user.id,
                product_id,
                quantity,
                price_snapshot: product.price
            }, {
                onConflict: 'user_id,product_id'
            })
            .select()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { cart_item_id, quantity } = body

        if (!cart_item_id || quantity === undefined) {
            return NextResponse.json({ error: 'Cart item ID and quantity required' }, { status: 400 })
        }

        if (quantity < 1) {
            // Delete if quantity is 0 or less
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', cart_item_id)
                .eq('user_id', user.id)

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ success: true, deleted: true }, { status: 200 })
        }

        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', cart_item_id)
            .eq('user_id', user.id)
            .select()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const cart_item_id = searchParams.get('id')

        if (!cart_item_id) {
            return NextResponse.json({ error: 'Cart item ID required' }, { status: 400 })
        }

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', cart_item_id)
            .eq('user_id', user.id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
