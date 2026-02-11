import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch products with optional filters
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)

        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const featured = searchParams.get('featured')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const condition = searchParams.get('condition')
        const sort = searchParams.get('sort') || 'created_at'
        const order = searchParams.get('order') || 'desc'
        const limit = parseInt(searchParams.get('limit') || '20')
        const offset = parseInt(searchParams.get('offset') || '0')

        let query = supabase
            .from('products')
            .select(`
                *,
                category:categories(id, name, display_name, slug)
            `, { count: 'exact' })
            .eq('status', 'active')

        // Filter by category slug
        if (category) {
            const { data: cat } = await supabase
                .from('categories')
                .select('id')
                .eq('name', category)
                .single()

            if (cat) {
                query = query.eq('category_id', cat.id)
            }
        }

        if (search) {
            query = query.ilike('title', `%${search}%`)
        }

        if (minPrice) {
            query = query.gte('price', parseFloat(minPrice))
        }

        if (maxPrice) {
            query = query.lte('price', parseFloat(maxPrice))
        }

        if (condition) {
            query = query.eq('condition', condition)
        }

        if (featured === 'true') {
            query = query.eq('is_featured', true).order('featured_order', { ascending: true })
        }

        // Apply sorting
        if (featured !== 'true') {
            const sortColumn = sort === 'price' ? 'price' : 'created_at'
            query = query.order(sortColumn, { ascending: order === 'asc' })
        }

        // Apply pagination
        query = query.range(offset, offset + limit - 1)

        const { data: products, error, count } = await query

        if (error) {
            console.error('Products query error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            products: products || [],
            total: count,
            limit,
            offset
        }, { status: 200 })
    } catch (error) {
        console.error('Products API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
