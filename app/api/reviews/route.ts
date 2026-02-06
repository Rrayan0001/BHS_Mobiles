import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// GET /api/reviews - Get approved reviews for a product
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('product_id')

        if (!productId) {
            return NextResponse.json({ error: 'product_id required' }, { status: 400 })
        }

        const { data, error } = await supabaseAdmin
            .from('product_reviews')
            .select('*')
            .eq('product_id', productId)
            .eq('status', 'approved')
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ reviews: data || [] })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST /api/reviews - Submit a new review (authenticated users)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { product_id, customer_name, rating, review_text, user_id } = body

        if (!product_id || !rating || !customer_name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
        }

        const { data, error } = await supabaseAdmin
            .from('product_reviews')
            .insert({
                product_id,
                user_id: user_id || null,
                customer_name,
                rating,
                review_text,
                status: 'pending'
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ review: data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
