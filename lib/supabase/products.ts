import { supabaseAdmin } from './admin'

// Product Types
export interface Product {
    id?: string
    title: string
    slug: string
    description?: string
    category_id: string
    sku?: string
    price: number
    compare_price?: number
    stock: number
    condition: 'A' | 'B' | 'C'
    status: 'active' | 'draft' | 'out_of_stock'
    images: string[]
}

export interface ProductSpecification {
    spec_name: string
    spec_value: string
}

/**
 * Upload product image to Supabase Storage
 */
export async function uploadProductImage(
    file: File,
    productSlug: string
): Promise<{ url: string | null; error: Error | null }> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${productSlug}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabaseAdmin.storage
        .from('product-images')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) {
        return { url: null, error }
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(data.path)

    return { url: publicUrl, error: null }
}

/**
 * Create a new product with specifications
 */
export async function createProduct(
    product: Product,
    specifications: ProductSpecification[]
) {
    // Insert product
    const { data: productData, error: productError } = await supabaseAdmin
        .from('products')
        .insert({
            title: product.title,
            slug: product.slug,
            description: product.description,
            category_id: product.category_id,
            sku: product.sku,
            price: product.price,
            compare_price: product.compare_price,
            stock: product.stock,
            condition: product.condition,
            status: product.status,
            images: product.images
        })
        .select()
        .single()

    if (productError) {
        return { data: null, error: productError }
    }

    // Insert specifications
    if (specifications.length > 0) {
        const specsToInsert = specifications.map(spec => ({
            product_id: productData.id,
            spec_name: spec.spec_name,
            spec_value: spec.spec_value
        }))

        const { error: specsError } = await supabaseAdmin
            .from('product_specifications')
            .insert(specsToInsert)

        if (specsError) {
            // Rollback product if specs fail
            await supabaseAdmin.from('products').delete().eq('id', productData.id)
            return { data: null, error: specsError }
        }
    }

    return { data: productData, error: null }
}

/**
 * Get all products with category info
 */
export async function getProducts(filters?: {
    category?: string
    status?: string
    search?: string
}) {
    let query = supabaseAdmin
        .from('products')
        .select(`
            *,
            category:categories(name, display_name)
        `)
        .order('created_at', { ascending: false })

    if (filters?.category) {
        query = query.eq('category_id', filters.category)
    }

    if (filters?.status) {
        query = query.eq('status', filters.status)
    }

    if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`)
    }

    return await query
}

/**
 * Get product by ID with specifications
 */
export async function getProductById(id: string) {
    const { data: product, error: productError } = await supabaseAdmin
        .from('products')
        .select(`
            *,
            category:categories(name, display_name),
            specifications:product_specifications(spec_name, spec_value)
        `)
        .eq('id', id)
        .single()

    return { data: product, error: productError }
}

/**
 * Get product by slug with specifications
 */
export async function getProductBySlug(slug: string) {
    const { data: product, error: productError } = await supabaseAdmin
        .from('products')
        .select(`
            *,
            category:categories(name, display_name),
            specifications:product_specifications(spec_name, spec_value)
        `)
        .eq('slug', slug)
        .single()

    return { data: product, error: productError }
}

/**
 * Update product
 */
export async function updateProduct(
    id: string,
    updates: Partial<Product>,
    specifications?: ProductSpecification[]
) {
    // Update product
    const { data: productData, error: productError } = await supabaseAdmin
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (productError) {
        return { data: null, error: productError }
    }

    // Update specifications if provided
    if (specifications) {
        // Delete existing specs
        await supabaseAdmin
            .from('product_specifications')
            .delete()
            .eq('product_id', id)

        // Insert new specs
        if (specifications.length > 0) {
            const specsToInsert = specifications.map(spec => ({
                product_id: id,
                spec_name: spec.spec_name,
                spec_value: spec.spec_value
            }))

            const { error: specsError } = await supabaseAdmin
                .from('product_specifications')
                .insert(specsToInsert)

            if (specsError) {
                return { data: null, error: specsError }
            }
        }
    }

    return { data: productData, error: null }
}

/**
 * Delete product
 */
export async function deleteProduct(id: string) {
    return await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id)
}

/**
 * Get all categories
 */
export async function getCategories() {
    return await supabaseAdmin
        .from('categories')
        .select('*')
        .order('display_name')
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}
