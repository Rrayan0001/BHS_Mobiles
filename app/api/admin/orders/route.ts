import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// GET /api/admin/orders - Get all orders for admin
export async function GET(request: NextRequest) {
    try {
        const { data: orders, error } = await supabaseAdmin
            .from('orders')
            .select(`
                id,
                order_number,
                email,
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
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Format orders for admin display
        const formattedOrders = (orders || []).map(order => ({
            id: order.id,
            order_number: order.order_number,
            customer: order.shipping_address?.fullName || 'Unknown',
            email: order.email,
            phone: order.shipping_address?.phone || '',
            date: new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            items: order.order_items?.length || 0,
            total: order.total,
            payment: order.payment_method || 'N/A',
            payment_status: order.payment_status,
            status: order.status,
        }))

        return NextResponse.json({ orders: formattedOrders })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
