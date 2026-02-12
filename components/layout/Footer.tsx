import React from 'react'
import Link from 'next/link'
import styles from './Footer.module.css'

const quickLinks = [
    { href: '/products', label: 'All Products' },
    { href: '/account/orders', label: 'Track Your Orders' },
    { href: '/returns-policy', label: 'Returns & Refunds' },
    { href: '/warranty', label: 'Warranty' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact Us' },
]

const paymentMethods = [
    { name: 'Google Pay', className: styles.gpay },
    { name: 'PhonePe', className: styles.phonepe },
    { name: 'UPI', className: styles.upi },
    { name: 'Cash', className: styles.cash },
]

const trustBadges = ['Verified Seller', 'Secure Payments', 'Local Store']
const mapUrl = 'https://maps.app.goo.gl/9HiUGaiBTz94MvAWA?g_st=ipc'
const mapEmbedUrl = 'https://maps.google.com/maps?q=Sangam%20Talkies%20Mulbagal&t=&z=15&ie=UTF8&iwloc=&output=embed'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.topBar}>
                    <div className={styles.brandBlock}>
                        <Link href="/" className={styles.logoLink}>
                            <span className={styles.logoAccent}>BHS</span> Mobiles
                        </Link>
                        <p className={styles.tagline}>Trusted mobile store in Mulbagal.</p>
                    </div>
                    <p className={styles.ownerInfo}>Owned by Mr. Nawaz Pasha S</p>
                </div>

                <div className={styles.footerGrid}>
                    <section className={`${styles.footerCard} ${styles.quickLinksCard}`} aria-labelledby="footer-quick-links">
                        <h2 id="footer-quick-links" className={styles.cardTitle}>Quick Links</h2>
                        <nav aria-label="Footer quick links">
                            <ul className={styles.linkList}>
                                {quickLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className={styles.footerLink}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </section>

                    <section className={`${styles.footerCard} ${styles.contactCard}`} aria-labelledby="footer-contact-info">
                        <h2 id="footer-contact-info" className={styles.cardTitle}>Contact Info</h2>
                        <address className={styles.contactInfo}>
                            <p className={styles.infoRow}>
                                <span className={styles.label}>Phone:</span>
                                <a className={styles.infoLink} href="tel:+919632564054">+91 96325 64054</a>
                            </p>
                            <p className={styles.infoRow}>
                                <span className={styles.label}>Email:</span>
                                <a className={styles.infoLink} href="mailto:nawazkhan96325@gmail.com">nawazkhan96325@gmail.com</a>
                            </p>
                            <p className={styles.infoRow}>
                                <span className={styles.label}>Address:</span>
                                Ramsandra Road, beside Sangam Talkies, Mulbagal 563131
                            </p>
                        </address>
                        <div className={styles.hours}>
                            <p className={styles.hoursTitle}>Store Hours</p>
                            <p className={styles.hoursText}>Mon-Sat: 11:00 AM - 7:00 PM</p>
                            <p className={styles.hoursText}>Sun: 12:00 PM - 5:00 PM</p>
                        </div>
                        <div className={styles.mobileActionRow}>
                            <a href="tel:+919632564054" className={styles.mobileActionBtn}>
                                Call Now
                            </a>
                            <a
                                href={mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.mobileActionBtn}
                            >
                                Directions
                            </a>
                        </div>
                        <Link href="/contact" className={styles.callbackBtn}>
                            Request Callback
                        </Link>
                    </section>

                    <section className={`${styles.footerCard} ${styles.locationCard}`} aria-labelledby="footer-location">
                        <h2 id="footer-location" className={styles.cardTitle}>Visit Store</h2>
                        <div className={styles.mapPreview}>
                            <iframe
                                className={styles.mapFrame}
                                src={mapEmbedUrl}
                                title="BHS Mobiles store location"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                        <p className={styles.locationText}>
                            Near Sangam Talkies, Ramsandra Road, Mulbagal.
                        </p>
                        <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.mapButton}
                            aria-label="Open store location in Google Maps"
                        >
                            Open in Google Maps
                        </a>
                    </section>

                    <section className={`${styles.footerCard} ${styles.trustCard}`} aria-labelledby="footer-trust">
                        <h2 id="footer-trust" className={styles.cardTitle}>Trust & Payments</h2>
                        <ul className={styles.paymentList} aria-label="Accepted payment methods">
                            {paymentMethods.map((method) => (
                                <li key={method.name} className={`${styles.paymentBadge} ${method.className}`}>
                                    {method.name}
                                </li>
                            ))}
                        </ul>
                        <ul className={styles.badgeList} aria-label="Store trust badges">
                            {trustBadges.map((badge) => (
                                <li key={badge} className={styles.trustBadge}>
                                    {badge}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        © {currentYear} Nawaz Mobiles. All rights reserved.
                    </p>
                    <div className={styles.socialLinks}>
                        <a
                            href="https://www.instagram.com/nawaz_mobiles_5640?igsh=Y254cmYwNHF1cG9u"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialIcon}
                            aria-label="Visit Nawaz Mobiles on Instagram"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
