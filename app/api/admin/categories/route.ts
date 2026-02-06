import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, display_name, description } = body

        // Generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()

        // Create category
        const { data, error } = await supabaseAdmin
            .from('categories')
            .insert({
                name,
                display_name,
                slug,
                description
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ category: data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
