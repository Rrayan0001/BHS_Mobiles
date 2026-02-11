'use client'

import React, { useState } from 'react'
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react'
import styles from './page.module.css'
import { Address } from '@/lib/types'

// Mock Data
const INITIAL_ADDRESSES: Address[] = [
    {
        id: '1',
        name: 'John Doe',
        phone: '+91 98765 43210',
        line1: '123, Main Street',
        line2: 'Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        is_default: true
    }
]

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<Partial<Address>>({
        name: '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        is_default: false
    })

    const handleAddClick = () => {
        setEditingId(null)
        setFormData({
            name: '',
            phone: '',
            line1: '',
            line2: '',
            city: '',
            state: '',
            pincode: '',
            is_default: addresses.length === 0 // Default true if first address
        })
        setIsModalOpen(true)
    }

    const handleEditClick = (address: Address) => {
        setEditingId(address.id)
        setFormData(address)
        setIsModalOpen(true)
    }

    const handleDeleteClick = (id: string) => {
        if (confirm('Are you sure you want to delete this address?')) {
            setAddresses(addresses.filter(a => a.id !== id))
        }
    }

    const handleSetDefault = (id: string) => {
        setAddresses(addresses.map(a => ({
            ...a,
            is_default: a.id === id
        })))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (editingId) {
            // Update existing
            setAddresses(addresses.map(a =>
                a.id === editingId
                    ? { ...formData, id: editingId } as Address
                    : a
            ))
        } else {
            // Add new
            const newAddress = {
                ...formData,
                id: Date.now().toString(),
                is_default: formData.is_default || addresses.length === 0
            } as Address

            if (newAddress.is_default) {
                // Unset other defaults if this one is default
                setAddresses([...addresses.map(a => ({ ...a, is_default: false })), newAddress])
            } else {
                setAddresses([...addresses, newAddress])
            }
        }

        setIsModalOpen(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Addresses</h1>
                <button onClick={handleAddClick} className={styles.addButton}>
                    <Plus size={20} />
                    Add New Address
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className={styles.emptyState}>
                    <MapPin className={styles.emptyStateIcon} />
                    <h3 className={styles.emptyStateTitle}>No Addresses Saved</h3>
                    <p className={styles.emptyStateText}>Add an address to make checkout faster.</p>
                </div>
            ) : (
                <div className={styles.addressGrid}>
                    {addresses.map(address => (
                        <div key={address.id} className={styles.addressCard}>
                            {address.is_default && (
                                <span className={styles.defaultBadge}>Default</span>
                            )}
                            <div className={styles.cardHeader}>
                                <span className={styles.name}>{address.name}</span>
                                <span className={styles.phone}>{address.phone}</span>
                            </div>
                            <div className={styles.cardBody}>
                                <p>{address.line1}</p>
                                {address.line2 && <p>{address.line2}</p>}
                                <p>{address.city}, {address.state} - {address.pincode}</p>
                            </div>
                            <div className={styles.cardActions}>
                                <button
                                    onClick={() => handleEditClick(address)}
                                    className={`${styles.actionBtn} ${styles.editBtn}`}
                                >
                                    Edit
                                </button>
                                {!address.is_default && (
                                    <button
                                        onClick={() => handleDeleteClick(address.id)}
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                    >
                                        Delete
                                    </button>
                                )}
                                {!address.is_default && (
                                    <button
                                        onClick={() => handleSetDefault(address.id)}
                                        className={`${styles.actionBtn} ${styles.setDefaultBtn}`}
                                    >
                                        Set as Default
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {editingId ? 'Edit Address' : 'Add New Address'}
                            </h2>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Full Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Phone Number</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Address Line 1</label>
                                <input
                                    name="line1"
                                    value={formData.line1}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                    placeholder="House No, Street Name"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Address Line 2 (Optional)</label>
                                <input
                                    name="line2"
                                    value={formData.line2}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Apartment, Studio, or Floor"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>City</label>
                                    <input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={styles.input}
                                        required
                                        placeholder="Mumbai"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>State</label>
                                    <input
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={styles.input}
                                        required
                                        placeholder="Maharashtra"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Pincode</label>
                                <input
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                    placeholder="400001"
                                />
                            </div>

                            <label className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    name="is_default"
                                    checked={formData.is_default}
                                    onChange={handleChange}
                                    className={styles.checkbox}
                                />
                                <span className={styles.label}>Make this my default address</span>
                            </label>

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className={styles.saveBtn}>
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
