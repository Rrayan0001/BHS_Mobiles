import Link from 'next/link'
import styles from './Hero.module.css'

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.heroContent}>
                    <div className={styles.textContent}>
                        <h1 className={styles.heroTitle}>
                            Your kid will drop it.<br />
                            <span className={styles.italic}>Pay less.</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            <b>CRAZY OFFER:</b> Grab the iPhone 15 for a price that makes no sense! Up to 70% OFF!
                        </p>
                        <Link href="/category/smartphones" className={styles.heroBtn}>
                            Save now
                        </Link>
                    </div>
                    <div className={styles.imageContent}>
                        {/* Visual representation of phones */}
                        <div className={styles.phonesWrapper}>
                            {/* CSS Art or Placeholder for phones */}
                            <div className={styles.phone} style={{ '--color': '#333' } as any}></div>
                            <div className={styles.phone} style={{ '--color': '#FAD5C5' } as any}></div>
                            <div className={styles.phone} style={{ '--color': '#E5E5EA' } as any}></div>
                            <div className={styles.phone} style={{ '--color': '#F2F4C3' } as any}></div>
                            <div className={styles.phone} style={{ '--color': '#A6C5DB' } as any}></div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
