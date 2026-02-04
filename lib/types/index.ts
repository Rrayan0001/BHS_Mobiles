// Database Types
export interface User {
    id: string
    email: string
    name?: string
    phone?: string
    addresses?: Address[]
    created_at: string
}

export interface Address {
    id: string
    name: string
    phone: string
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
    is_default: boolean
}

export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    icon?: string
    sort_order: number
}

export interface Subcategory {
    id: string
    category_id: string
    name: string
    slug: string
    description?: string
    seo_description?: string
    category?: Category
}

export interface AttributeDefinition {
    id: string
    subcategory_id: string
    name: string
    label: string
    type: 'text' | 'number' | 'select' | 'textarea'
    options?: string[]
    is_filterable: boolean
    is_required: boolean
    sort_order: number
}

export interface Product {
    id: string
    subcategory_id: string
    sku: string
    title: string
    description?: string
    price: number
    compare_at_price?: number
    stock_quantity: number
    condition_grade: 'A' | 'B' | 'C'
    warranty_months: number
    status: 'draft' | 'published' | 'archived'
    created_at: string
    updated_at: string
    subcategory?: Subcategory
    images?: ProductImage[]
    attributes?: ProductAttribute[]
}

export interface ProductAttribute {
    id: string
    product_id: string
    attribute_definition_id: string
    value: string
    definition?: AttributeDefinition
}

export interface ProductImage {
    id: string
    product_id: string
    url: string
    alt_text?: string
    sort_order: number
    is_primary: boolean
}

export interface CartItem {
    id: string
    user_id: string
    product_id: string
    quantity: number
    price_snapshot: number
    added_at: string
    product?: Product
}

export interface Order {
    id: string
    user_id: string
    order_number: string
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    subtotal: number
    tax: number
    shipping: number
    total: number
    shipping_address: Address
    billing_address: Address
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
    payment_method: string
    created_at: string
    items?: OrderItem[]
}

export interface OrderItem {
    id: string
    order_id: string
    product_id: string
    quantity: number
    unit_price: number
    product_snapshot: string
    product?: Product
}

export interface VehicleInquiry {
    id: string
    product_id: string
    name: string
    phone: string
    email?: string
    message?: string
    preferred_contact_time?: string
    status: 'new' | 'contacted' | 'converted' | 'closed'
    created_at: string
    product?: Product
}

// Condition Grade Info
export interface ConditionGradeInfo {
    grade: 'A' | 'B' | 'C'
    label: string
    description: string
    batteryHealth: string
    warranty: string
    color: string
}

export const CONDITION_GRADES: Record<'A' | 'B' | 'C', ConditionGradeInfo> = {
    A: {
        grade: 'A',
        label: 'Like New',
        description: 'Minimal or no wear; fully functional',
        batteryHealth: '> 90%',
        warranty: '6 months',
        color: 'success',
    },
    B: {
        grade: 'B',
        label: 'Good',
        description: 'Visible wear; fully functional',
        batteryHealth: '> 80%',
        warranty: '3 months',
        color: 'primary',
    },
    C: {
        grade: 'C',
        label: 'Fair',
        description: 'Noticeable wear; functional with known issues',
        batteryHealth: '> 70%',
        warranty: '30 days',
        color: 'warning',
    },
}

// Filter Types
export interface FilterOption {
    label: string
    value: string
    count?: number
}

export interface ProductFilters {
    subcategory?: string
    brands?: string[]
    priceMin?: number
    priceMax?: number
    condition?: ('A' | 'B' | 'C')[]
    [key: string]: any // Dynamic attributes
}

export interface SearchParams {
    q?: string
    category?: string
    subcategory?: string
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
    page?: number
    limit?: number
}
