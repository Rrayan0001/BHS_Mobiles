import Hero from '@/components/home/Hero'
import CategoryIcons from '@/components/home/CategoryIcons'
import ParallaxTextBand from '@/components/home/ParallaxTextBand'
import TopPicksMarquee from '@/components/home/TopPicksMarquee'
import styles from './page.module.css'

const PARALLAX_PROMISE_TEXT =
    'Certified Refurbished • Up to 70% Savings • 6-Month Warranty • 50-Point Quality Check • Fast Delivery • Easy Returns • Genuine Accessories • iPhone • Android • Apple Watch'

export default function Home() {
    return (
        <main className={styles.main}>
            <Hero />

            <CategoryIcons />

            <ParallaxTextBand text={PARALLAX_PROMISE_TEXT} />

            <TopPicksMarquee />
        </main>
    )
}
