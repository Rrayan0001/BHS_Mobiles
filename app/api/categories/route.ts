import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface CategoryRecord {
    id: string
    name: string
    slug: string
    display_name?: string | null
}

const DEFAULT_LIMIT = 5
const MAX_LIMIT = 100

const parseLimit = (value: string | null) => {
    if (!value) return DEFAULT_LIMIT

    const parsed = Number.parseInt(value, 10)
    if (!Number.isFinite(parsed) || parsed < 1) {
        return DEFAULT_LIMIT
    }

    return Math.min(parsed, MAX_LIMIT)
}

const normalize = (category: CategoryRecord) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    display_name: category.display_name ?? null,
})

// GET /api/categories - Public category list for storefront navigation
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const limit = parseLimit(searchParams.get('limit'))

        const withDisplayName = await supabase
            .from('categories')
            .select('id, name, slug, display_name')
            .order('display_name', { ascending: true })
            .limit(limit)

        if (!withDisplayName.error) {
            const categories = (withDisplayName.data || [])
                .filter((category) => category.slug)
                .map((category) => normalize(category as CategoryRecord))

            return NextResponse.json({ categories })
        }

        const fallback = await supabase
            .from('categories')
            .select('id, name, slug')
            .order('name', { ascending: true })
            .limit(limit)

        if (fallback.error) {
            return NextResponse.json({ error: fallback.error.message }, { status: 500 })
        }

        const categories = (fallback.data || [])
            .filter((category) => category.slug)
            .map((category) => normalize(category as CategoryRecord))

        return NextResponse.json({ categories })
    } catch (error) {
        console.error('Categories API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
