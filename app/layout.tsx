import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

export const metadata: Metadata = {
    title: 'BHS Mobiles - Trusted Refurbished Phones & Electronics',
    description: 'Find tested, guaranteed refurbished smartphones, accessories, wearables, and vehicles. Every device inspected and certified with warranty.',
    keywords: ['refurbished phones', 'second hand mobiles', 'used phones', 'certified pre-owned', 'warranty', 'tested devices'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <CartProvider>
                        <Header />
                        {children}
                        <Footer />
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
