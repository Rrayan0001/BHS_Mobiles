import React from 'react'
import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className="container">
                {/* Top Bar: Logo & Owner */}
                <div className={styles.topBar}>
                    <div className={styles.logoSection}>
                        <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>
                            <span style={{ color: '#00C853' }}>BHS</span> Mobiles
                        </h2>
                    </div>
                    <div className={styles.ownerInfo}>
                        Owned By: Mr. Nawaz
                    </div>
                </div>

                {/* 4-Column Card Grid */}
                <div className={styles.footerGrid}>

                    {/* Column 1: Contact Info */}
                    <div className={styles.footerCard}>
                        <h4 className={styles.cardTitle}>Contact Info</h4>
                        <div className={styles.contactInfo}>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Phone:</span>
                                <a href="tel:+919632564054" style={{ color: 'inherit', textDecoration: 'none' }}>+91 96325 64054</a>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Email:</span>
                                <a href="mailto:info@nawazmobiles.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@nawazmobiles.com</a>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Address:</span>
                                Ramsandra Road Beside Sangam Talkies Mulbagal 563131
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Hours:</span>
                                Mon-Sat 11AM-7PM <br />
                                Sun 12PM-5PM
                            </div>

                            <Link href="/contact" className={styles.callbackBtn}>
                                📞 Request Callback
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className={styles.footerCard}>
                        <h4 className={styles.cardTitle}>Quick Links</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/orders" className={styles.footerLink}>Track Your Order</Link></li>
                            <li><Link href="/terms-of-service" className={styles.footerLink}>Terms & Condition</Link></li>
                            <li><Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link></li>
                            <li><Link href="/returns-policy" className={styles.footerLink}>Refund Policy</Link></li>
                            <li><Link href="/returns-policy" className={styles.footerLink}>Return Policy</Link></li>
                            <li><Link href="/about" className={styles.footerLink}>About Us</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Location (Live Map) */}
                    <div className={styles.footerCard}>
                        <h4 className={styles.cardTitle}>Location</h4>
                        <div className={styles.mapLink}>
                            <iframe
                                src="https://maps.google.com/maps?q=Sangam%20Talkies%20Mulbagal&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title="Store Location"
                            ></iframe>
                        </div>
                        <a
                            href="https://maps.app.goo.gl/9HiUGaiBTz94MvAWA?g_st=ipc"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.85rem', color: '#3182ce', marginTop: '8px', display: 'block' }}
                        >
                            Open in Google Maps ↗
                        </a>
                    </div>

                    {/* Column 4: Certifications & Payments */}
                    <div className={styles.footerCard}>
                        <h4 className={styles.cardTitle}>We Accept</h4>
                        <div className={styles.paymentSection}>
                            <div className={styles.paymentIcons}>
                                {/* GPY */}
                                <div className={styles.paymentIcon} title="Google Pay" style={{ background: 'white' }}>
                                    <svg viewBox="0 0 24 24" width="32" height="32">
                                        <path fill="#4285F4" d="M11.66 10.3h-7.6v2.12h4.52c-.17.92-1.09 2.7-4.5 2.7-2.71 0-4.92-2.22-4.92-4.95s2.21-4.95 4.92-4.95c1.22 0 2.29.43 3.12 1.22l1.58-1.58C7.75 3.86 6.44 3.2 5.06 3.2 2.27 3.2 0 5.42 0 8.16s2.27 4.95 5.06 4.95c3.8 0 5.4-2.67 5.18-5.71H8.76v2.9h2.9z" />
                                        <path fill="#34A853" d="M15.42 6.55h2.12v6.6h-2.12z" />
                                    </svg>
                                </div>
                                {/* PhonePe (Simplified) */}
                                <div className={styles.paymentIcon} title="PhonePe" style={{ background: '#5f259f' }}>
                                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', fontFamily: 'sans-serif' }}>Pe</span>
                                </div>
                                {/* PayTM/UPI */}
                                <div className={styles.paymentIcon} title="UPI" style={{ background: 'white' }}>
                                    <span style={{ color: '#333', fontWeight: 'bold', fontSize: '0.8rem', fontFamily: 'sans-serif' }}>UPI</span>
                                </div>
                                {/* Cash */}
                                <div className={styles.paymentIcon} title="Cash" style={{ background: '#00C853' }}>
                                    <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05 1.18 1.91 2.53 1.91 1.29 0 2.13-.86 2.13-2.03 0-1.01-.55-1.53-1.45-2.04l-2.01-1.17c-1.59-.9-4.37-2.16-4.37-5.23 0-1.85 1.48-3.05 3.19-3.37V2.5h2.67v1.9c1.7.35 2.92 1.4 3.12 3.2h-1.92c-.12-.89-1.08-1.57-2.31-1.57-1.14 0-1.92.83-1.92 1.91 0 .93.52 1.45 1.34 1.93l2.09 1.21c1.8.96 4.49 2.15 4.49 5.37 0 1.93-1.51 3.2-3.35 3.55z" />
                                    </svg>
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <h4 className={styles.cardTitle}>Certifications</h4>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <div style={{ background: 'white', padding: '6px 10px', borderRadius: '4px', fontSize: '0.8rem', color: '#0a1f44', fontWeight: 'bold', border: '1px solid #ddd' }}>
                                        ✓ Verified
                                    </div>
                                    <div style={{ background: 'white', padding: '6px 10px', borderRadius: '4px', fontSize: '0.8rem', color: '#0a1f44', fontWeight: 'bold', border: '1px solid #ddd' }}>
                                        🛡️ Secure
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <div className={styles.copyright}>
                        © {currentYear} Nawaz Mobiles. All rights reserved.
                    </div>
                    <div className={styles.socialLinks}>
                        <a href="https://www.instagram.com/nawaz_mobiles_5640?igsh=Y254cmYwNHF1cG9u" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                            Instagram ↗
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
