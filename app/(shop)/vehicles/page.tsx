'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import styles from './page.module.css'

export default function VehiclesPage() {
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null)

    const vehicles = [
        {
            id: 'VEH-001',
            title: '2020 Maruti Swift ZXi',
            price: 650000,
            image: '/placeholder.jpg',
            specs: { year: 2020, kms: '25,000 km', fuel: 'Petrol', owner: '1st' },
            location: 'Bangalore'
        },
        {
            id: 'VEH-002',
            title: '2019 Hyundai Creta SX',
            price: 980000,
            image: '/placeholder.jpg',
            specs: { year: 2019, kms: '42,000 km', fuel: 'Diesel', owner: '1st' },
            location: 'Mysore'
        },
        {
            id: 'VEH-003',
            title: '2021 Royal Enfield Classic 350',
            price: 185000,
            image: '/placeholder.jpg',
            specs: { year: 2021, kms: '12,000 km', fuel: 'Petrol', owner: '1st' },
            location: 'Bangalore'
        }
    ]

    const handleInquiry = (vehicle: any) => {
        setSelectedVehicle(vehicle)
        setInquiryModalOpen(true)
    }

    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <div className="container">
                    <h1 className={styles.heroTitle}>Certified Used Vehicles</h1>
                    <p className={styles.heroSubtitle}>
                        Quality checked cars and bikes with warranty.
                    </p>
                </div>
            </div>

            <div className="container">
                <div className={styles.filters}>
                    <select className={styles.filterSelect}><option>All Types</option><option>Cars</option><option>Bikes</option></select>
                    <select className={styles.filterSelect}><option>Any Brand</option><option>Maruti</option><option>Hyundai</option></select>
                    <select className={styles.filterSelect}><option>Price Range</option></select>
                </div>

                <div className={styles.grid}>
                    {vehicles.map((vehicle) => (
                        <Card key={vehicle.id} padding="none" className={styles.vehicleCard}>
                            <div className={styles.imageWrapper}>
                                <div className={styles.imagePlaceholder}>🚗</div>
                                <div className={styles.priceTag}>₹{vehicle.price.toLocaleString()}</div>
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.vehicleTitle}>{vehicle.title}</h3>
                                <div className={styles.specsGrid}>
                                    <div className={styles.specItem}>
                                        <span className={styles.specIcon}>📅</span>
                                        {vehicle.specs.year}
                                    </div>
                                    <div className={styles.specItem}>
                                        <span className={styles.specIcon}>🛣️</span>
                                        {vehicle.specs.kms}
                                    </div>
                                    <div className={styles.specItem}>
                                        <span className={styles.specIcon}>⛽</span>
                                        {vehicle.specs.fuel}
                                    </div>
                                    <div className={styles.specItem}>
                                        <span className={styles.specIcon}>👤</span>
                                        {vehicle.specs.owner} Owner
                                    </div>
                                </div>
                                <div className={styles.location}>
                                    <span>📍 {vehicle.location}</span>
                                </div>
                                <div className={styles.actions}>
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        onClick={() => handleInquiry(vehicle)}
                                    >
                                        Request Quote
                                    </Button>
                                    <Link href={`/product/${vehicle.id}`} style={{ width: '100%' }}>
                                        <Button variant="outline" fullWidth>View Details</Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {inquiryModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Request Quote for {selectedVehicle?.title}</h3>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setInquiryModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <form className={styles.inquiryForm}>
                            <div className={styles.formGroup}>
                                <label>Name</label>
                                <input type="text" placeholder="Your Name" className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Phone</label>
                                <input type="tel" placeholder="Your Phone" className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Message (Optional)</label>
                                <textarea placeholder="I'm interested in this vehicle..." className={styles.textarea}></textarea>
                            </div>
                            <Button type="submit" variant="primary" fullWidth>Send Request</Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
