'use client'

import React from 'react'
import Link from 'next/link'
import Hero from '@/components/home/Hero'
import CategoryIcons from '@/components/home/CategoryIcons'
import TopPicksMarquee from '@/components/home/TopPicksMarquee'
import TopPicks from '@/components/TopPicks'
import styles from './page.module.css'

export default function Home() {
    return (
        <main className={styles.main}>
            <Hero />

            {/* New Category Icons Section */}
            <CategoryIcons />

            {/* Top Picks Section */}
            <TopPicks />

            {/* Top Picks Marquee */}
            <TopPicksMarquee />
        </main>
    )
}
