'use client'

import type { Metadata } from 'next'
import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith('/admin')

    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <AuthProvider>
                    <CartProvider>
                        {!isAdminRoute && <Header />}
                        {children}
                        {!isAdminRoute && <Footer />}
                        {!isAdminRoute && <WhatsAppButton />}
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
