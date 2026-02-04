export const generateProductSchema = (product: any) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.image,
        sku: product.sku,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'INR',
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: getConditionSchema(product.condition),
        },
        brand: {
            '@type': 'Brand',
            name: product.specs?.brand || 'Generic',
        },
    }
}

export const generateOrganizationSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Nawaz Mobiles',
        url: 'https://nawazmobiles.com',
        logo: 'https://nawazmobiles.com/logo.png',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-9632564054',
            contactType: 'Customer Service',
            areaServed: 'IN',
        },
        sameAs: [
            'https://www.instagram.com/nawaz_mobiles_5640',
        ],
    }
}

const getConditionSchema = (condition: string) => {
    switch (condition?.toUpperCase()) {
        case 'A': return 'https://schema.org/RefurbishedCondition' // Closest mapping
        case 'B': return 'https://schema.org/UsedCondition'
        default: return 'https://schema.org/UsedCondition'
    }
}
