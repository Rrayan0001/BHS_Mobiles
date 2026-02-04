import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch single product by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { id } = await params

        const { data: product, error } = await supabase
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
                updated_at,
                subcategory_id,
                subcategories (
                    id,
                    name,
                    slug,
                    description,
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
                        label,
                        type
                    )
                )
            `)
            .eq('id', id)
            .eq('status', 'published')
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 })
            }
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ product }, { status: 200 })
    } catch (error) {
        console.error('Product API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
