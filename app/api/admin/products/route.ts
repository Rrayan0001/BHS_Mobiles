import { NextRequest, NextResponse } from 'next/server'
import { createProduct, getProducts, generateSlug } from '@/lib/supabase/products'
import { getCategories } from '@/lib/supabase/products'

// GET /api/admin/products - Get all products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category') || undefined
        const status = searchParams.get('status') || undefined
        const search = searchParams.get('search') || undefined

        const { data, error } = await getProducts({ category, status, search })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ products: data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            title,
            description,
            category_id,
            sku,
            price,
            compare_price,
            stock,
            condition,
            status,
            images,
            is_featured,
            featured_order,
            specifications
        } = body

        // Generate slug from title
        const slug = generateSlug(title)

        // Create product
        const { data, error } = await createProduct(
            {
                title,
                slug,
                description,
                category_id,
                sku,
                price: parseFloat(price),
                compare_price: compare_price ? parseFloat(compare_price) : undefined,
                stock: parseInt(stock),
                condition,
                status,
                images: images || [],
                is_featured,
                featured_order
            },
            specifications || []
        )

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ product: data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
