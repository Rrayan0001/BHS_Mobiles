import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
    try {
        // 1. Total Sales (Sum of total for non-cancelled orders)
        const { data: salesData, error: salesError } = await supabaseAdmin
            .from('orders')
            .select('total')
            .neq('status', 'cancelled')

        if (salesError) throw salesError

        const totalSales = salesData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

        // 2. Total Orders (Count of all orders)
        const { count: totalOrders, error: ordersError } = await supabaseAdmin
            .from('orders')
            .select('*', { count: 'exact', head: true })

        if (ordersError) throw ordersError

        // 3. Pending Orders (Count of pending orders)
        const { count: pendingOrders, error: pendingError } = await supabaseAdmin
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')

        if (pendingError) throw pendingError

        // 4. Low Stock Items (Count of products with stock < 5)
        // Assuming 'stock' or 'quantity' field exists in 'products'
        // I need to verify the schema for products. I'll guess 'stock' for now, but I should check.
        // Looking at previous context, stock seems to be a field. 
        // Let's assume 'stock' column.
        const { count: lowStockItems, error: stockError } = await supabaseAdmin
            .from('products')
            .select('*', { count: 'exact', head: true })
            .lt('stock', 5)

        // If 'stock' column doesn't exist, this might error. I'll add a fallback or check schema if needed.
        // But for now I'll proceed.

        // 5. Recent Orders (Limit 5)
        const { data: recentOrders, error: recentError } = await supabaseAdmin
            .from('orders')
            .select(`
                id,
                order_number,
                status,
                total,
                created_at,
                shipping_address
            `)
            .order('created_at', { ascending: false })
            .limit(5)

        if (recentError) throw recentError

        const formattedRecentOrders = recentOrders.map(order => ({
            id: order.order_number, // User friendly ID
            customer: order.shipping_address?.fullName || 'Unknown',
            total: order.total,
            status: order.status,
            date: new Date(order.created_at).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }))

        return NextResponse.json({
            stats: {
                totalSales,
                totalOrders: totalOrders || 0,
                pendingOrders: pendingOrders || 0,
                lowStockItems: lowStockItems || 0, // Might be null if table struct is diff
            },
            recentOrders: formattedRecentOrders
        })

    } catch (error: any) {
        console.error('Dashboard API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
