export type PurchaseMode = 'single_unit' | 'multi_unit'

const MULTI_UNIT_CATEGORY_SLUGS = new Set([
    'accessories',
    'accessory',
    'airpods',
    'earpods',
])

interface PurchaseModeSource {
    purchase_mode?: string | null
    is_single_unit?: boolean | null
    category_slug?: string | null
    category?: {
        slug?: string | null
        name?: string | null
        display_name?: string | null
    } | null
}

const normalizeCategorySlug = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')

export function resolvePurchaseMode(source: PurchaseModeSource): PurchaseMode {
    if (source.purchase_mode === 'single_unit') return 'single_unit'
    if (source.purchase_mode === 'multi_unit') return 'multi_unit'

    if (typeof source.is_single_unit === 'boolean') {
        return source.is_single_unit ? 'single_unit' : 'multi_unit'
    }

    const rawCategory =
        source.category_slug ||
        source.category?.slug ||
        source.category?.name ||
        source.category?.display_name

    if (!rawCategory) return 'single_unit'

    return MULTI_UNIT_CATEGORY_SLUGS.has(normalizeCategorySlug(rawCategory))
        ? 'multi_unit'
        : 'single_unit'
}

export function getMaxAllowedQuantity(
    purchaseMode: PurchaseMode,
    stock: number | null | undefined
): number {
    const safeStock =
        typeof stock === 'number' && Number.isFinite(stock)
            ? Math.max(0, Math.floor(stock))
            : 0

    if (purchaseMode === 'single_unit') {
        return safeStock > 0 ? 1 : 0
    }

    return safeStock
}
