import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// GET /api/admin/banners - Get all banners
export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabaseAdmin
            .from('banners')
            .select('*')
            .order('display_order', { ascending: true })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ banners: data || [] })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST /api/admin/banners - Create new banner
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, subtitle, image_url, link_url, button_text, is_active, display_order } = body

        const { data, error } = await supabaseAdmin
            .from('banners')
            .insert({
                title,
                subtitle,
                image_url,
                link_url,
                button_text: button_text || 'Shop Now',
                is_active: is_active || false,
                display_order: display_order || 0
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ banner: data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
