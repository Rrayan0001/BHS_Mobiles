import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch products with optional filters
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)

        const category = searchParams.get('category')
        const subcategory = searchParams.get('subcategory')
        const search = searchParams.get('search')
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
                id,
                sku,
                title,
                description,
                price,
                compare_at_price,
                stock_quantity,
                condition_grade,
                warranty_months,
                status,
                created_at,
                subcategory_id,
                subcategories (
                    id,
                    name,
                    slug,
                    category_id,
                    categories (
                        id,
                        name,
                        slug
                    )
                ),
                product_images (
                    id,
                    url,
                    alt_text,
                    is_primary,
                    sort_order
                ),
                product_attributes (
                    id,
                    value,
                    attribute_definition_id,
                    attribute_definitions (
                        name,
                        label
                    )
                )
            `, { count: 'exact' })
            .eq('status', 'published')

        // Apply filters
        if (subcategory) {
            const { data: sub } = await supabase
                .from('subcategories')
                .select('id')
                .eq('slug', subcategory)
                .single()

            if (sub) {
                query = query.eq('subcategory_id', sub.id)
            }
        }

        if (category) {
            const { data: cats } = await supabase
                .from('subcategories')
                .select('id, categories!inner(slug)')
                .eq('categories.slug', category)

            if (cats && cats.length > 0) {
                query = query.in('subcategory_id', cats.map(c => c.id))
            }
        }

        if (search) {
            query = query.textSearch('title', search, { type: 'websearch' })
        }

        if (minPrice) {
            query = query.gte('price', parseFloat(minPrice))
        }

        if (maxPrice) {
            query = query.lte('price', parseFloat(maxPrice))
        }

        if (condition) {
            query = query.eq('condition_grade', condition)
        }

        // Apply sorting
        const sortColumn = sort === 'price' ? 'price' : 'created_at'
        query = query.order(sortColumn, { ascending: order === 'asc' })

        // Apply pagination
        query = query.range(offset, offset + limit - 1)

        const { data: products, error, count } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            products,
            total: count,
            limit,
            offset
        }, { status: 200 })
    } catch (error) {
        console.error('Products API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
