import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch single product by Slug or ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // 'id' here captures the last segment, which is the slug
) {
    try {
        const supabase = await createClient()
        const { id: slugOrId } = await params

        // Try to find by slug first (since URLs use slugs)
        let query = supabase
            .from('products')
            .select(`
                *,
                category:categories(id, name, display_name, slug),
                specifications:product_specifications(spec_name, spec_value)
            `)
            .eq('slug', slugOrId)
            .single()

        let { data: product, error } = await query

        // If not found by slug, and it looks like a UUID, try by ID
        if (error && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId)) {
            const idQuery = supabase
                .from('products')
                .select(`
                    *,
                    category:categories(id, name, display_name, slug),
                    specifications:product_specifications(spec_name, spec_value)
                `)
                .eq('id', slugOrId)
                .single()

            const result = await idQuery
            product = result.data
            error = result.error
        }

        if (error || !product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Return standardized product object
        return NextResponse.json({
            product: {
                ...product,
                // Ensure specifications are formatted correctly if needed
                attributes: product.specifications?.map((s: any) => ({
                    label: s.spec_name,
                    value: s.spec_value
                })) || []
            }
        }, { status: 200 })

    } catch (error) {
        console.error('Product API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
