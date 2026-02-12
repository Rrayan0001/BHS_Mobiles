'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from './page.module.css'

interface CheckoutAddress {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
}

const EMPTY_ADDRESS: CheckoutAddress = {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
}

export default function CheckoutPage() {
    const router = useRouter()
    const { user, isAuthenticated } = useAuth()
    const { items: cartItems, subtotal, itemCount, clearCart } = useCart()
    const [placing, setPlacing] = useState(false)
    const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping')

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=/checkout')
        }
    }, [isAuthenticated, router])

    // Redirect if cart is empty
    useEffect(() => {
        if (itemCount === 0) {
            router.push('/products')
        }
    }, [itemCount, router])

    // Form state
    const [shippingAddress, setShippingAddress] = useState<CheckoutAddress>(EMPTY_ADDRESS)
    const [billingAddress, setBillingAddress] = useState<CheckoutAddress>(EMPTY_ADDRESS)
    const [savedAddress, setSavedAddress] = useState<CheckoutAddress | null>(null)
    const [loadingSavedAddress, setLoadingSavedAddress] = useState(true)
    const [sameAsShipping, setSameAsShipping] = useState(true)
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online')
    const shipping = subtotal >= 50000 ? 0 : 200
    const tax = Math.round(subtotal * 0.18) // 18% GST
    const total = subtotal + shipping + tax

    useEffect(() => {
        if (!isAuthenticated || !user?.email) {
            setLoadingSavedAddress(false)
            return
        }

        let cancelled = false

        const fetchSavedAddress = async () => {
            setLoadingSavedAddress(true)
            try {
                const response = await fetch('/api/users/address')
                if (!response.ok) return

                const data = await response.json() as { address?: CheckoutAddress | null }
                if (!data.address || cancelled) return

                setSavedAddress(data.address)
                setShippingAddress(data.address)
                setBillingAddress(data.address)
            } catch (error) {
                console.error('Failed to fetch saved address:', error)
            } finally {
                if (!cancelled) {
                    setLoadingSavedAddress(false)
                }
            }
        }

        fetchSavedAddress()

        return () => {
            cancelled = true
        }
    }, [isAuthenticated, user?.email])

    const persistShippingAddress = async () => {
        if (!isAuthenticated || !user?.email) {
            return
        }

        try {
            const response = await fetch('/api/users/address', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: shippingAddress })
            })

            if (response.ok) {
                setSavedAddress(shippingAddress)
            }
        } catch (error) {
            console.error('Failed to save address:', error)
        }
    }

    const validateShipping = () => {
        const { fullName, phone, address, city, state, pincode } = shippingAddress
        if (!fullName.trim()) { alert('Full Name is required'); return false }
        if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) { alert('Please enter a valid 10-digit phone number'); return false }
        if (!address.trim()) { alert('Address is required'); return false }
        if (!city.trim()) { alert('City is required'); return false }
        if (!state.trim()) { alert('State is required'); return false }
        if (!pincode.trim() || pincode.replace(/[^0-9]/g, '').length !== 6) { alert('Please enter a valid 6-digit pincode'); return false }
        return true
    }

    const validateBilling = () => {
        if (sameAsShipping) return true
        const { fullName, phone, address, city, state, pincode } = billingAddress
        if (!fullName.trim()) { alert('Billing Full Name is required'); return false }
        if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) { alert('Please enter a valid billing phone number'); return false }
        if (!address.trim()) { alert('Billing Address is required'); return false }
        if (!city.trim()) { alert('Billing City is required'); return false }
        if (!state.trim()) { alert('Billing State is required'); return false }
        if (!pincode.trim() || pincode.replace(/[^0-9]/g, '').length !== 6) { alert('Please enter a valid billing pincode'); return false }
        return true
    }

    const handlePlaceOrder = async () => {
        if (!validateShipping()) {
            setStep('shipping')
            return
        }
        if (!validateBilling()) {
            setStep('payment')
            setSameAsShipping(false)
            return
        }

        await persistShippingAddress()
        setPlacing(true)
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shipping_address: shippingAddress,
                    billing_address: sameAsShipping ? shippingAddress : billingAddress,
                    payment_method: paymentMethod,
                    items: cartItems,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to place order')
            }

            clearCart()
            router.push(`/checkout/success?order=${data.order.order_number}`)
        } catch (error: any) {
            alert(error.message || 'Failed to place order. Please try again.')
        } finally {
            setPlacing(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className="container">
                <h1 className={styles.title}>Checkout</h1>

                <div className={styles.layout}>
                    <div className={styles.main}>
                        {/* Progress Steps */}
                        <div className={styles.steps}>
                            <div className={`${styles.stepItem} ${step === 'shipping' ? styles.stepActive : styles.stepComplete}`}>
                                <div className={styles.stepNumber}>1</div>
                                <span>Shipping</span>
                            </div>
                            <div className={`${styles.stepItem} ${step === 'payment' ? styles.stepActive : step === 'review' ? styles.stepComplete : ''}`}>
                                <div className={styles.stepNumber}>2</div>
                                <span>Payment</span>
                            </div>
                            <div className={`${styles.stepItem} ${step === 'review' ? styles.stepActive : ''}`}>
                                <div className={styles.stepNumber}>3</div>
                                <span>Review</span>
                            </div>
                        </div>

                        {/* Step 1: Shipping */}
                        {step === 'shipping' && (
                            <Card padding="lg">
                                <h2 className={styles.sectionTitle}>Shipping Information</h2>

                                {loadingSavedAddress ? (
                                    <div className={styles.savedAddressLoading}>Checking saved delivery address...</div>
                                ) : savedAddress ? (
                                    <div className={styles.savedAddressBox}>
                                        <div className={styles.savedAddressHeader}>
                                            <span>Saved delivery address</span>
                                            <button
                                                type="button"
                                                className={styles.savedAddressButton}
                                                onClick={() => {
                                                    setShippingAddress(savedAddress)
                                                    if (sameAsShipping) {
                                                        setBillingAddress(savedAddress)
                                                    }
                                                }}
                                            >
                                                Use this address
                                            </button>
                                        </div>
                                        <p className={styles.savedAddressText}>
                                            {savedAddress.fullName} | {savedAddress.phone}<br />
                                            {savedAddress.address}<br />
                                            {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
                                        </p>
                                    </div>
                                ) : null}

                                <div className={styles.formGrid}>
                                    <Input
                                        label="Full Name"
                                        placeholder="John Doe"
                                        value={shippingAddress.fullName}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                        fullWidth
                                        required
                                    />
                                    <Input
                                        label="Phone Number"
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={shippingAddress.phone}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                        fullWidth
                                        required
                                    />
                                </div>

                                <Input
                                    label="Address"
                                    placeholder="Street address, apartment, suite, etc."
                                    value={shippingAddress.address}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                    fullWidth
                                    required
                                />

                                <div className={styles.formGrid}>
                                    <Input
                                        label="City"
                                        placeholder="Mumbai"
                                        value={shippingAddress.city}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        fullWidth
                                        required
                                    />
                                    <Input
                                        label="State"
                                        placeholder="Maharashtra"
                                        value={shippingAddress.state}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                        fullWidth
                                        required
                                    />
                                    <Input
                                        label="Pincode"
                                        placeholder="400001"
                                        value={shippingAddress.pincode}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                                        fullWidth
                                        required
                                    />
                                </div>

                                <div className={styles.actions}>
                                    <Button variant="primary" size="lg" onClick={async () => {
                                        if (!validateShipping()) {
                                            return
                                        }

                                        await persistShippingAddress()
                                        setStep('payment')
                                    }}>
                                        Continue to Payment
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {/* Step 2: Payment */}
                        {step === 'payment' && (
                            <Card padding="lg">
                                <h2 className={styles.sectionTitle}>Payment Method</h2>

                                <div className={styles.paymentMethods}>
                                    <label className={`${styles.paymentOption} ${paymentMethod === 'online' ? styles.paymentOptionActive : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="online"
                                            checked={paymentMethod === 'online'}
                                            onChange={(e) => setPaymentMethod(e.target.value as 'online')}
                                        />
                                        <div className={styles.paymentOptionContent}>
                                            <div className={styles.paymentOptionHeader}>
                                                <strong>Online Payment</strong>
                                                <span className={styles.recommendedBadge}>Recommended</span>
                                            </div>
                                            <p>Pay securely with UPI, Cards, Net Banking, or Wallets</p>
                                        </div>
                                    </label>

                                    <label className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.paymentOptionActive : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                                        />
                                        <div className={styles.paymentOptionContent}>
                                            <strong>Cash on Delivery</strong>
                                            <p>Pay when you receive your order</p>
                                        </div>
                                    </label>
                                </div>

                                <div className={styles.billingSection}>
                                    <h3>Billing Address</h3>
                                    <label className={styles.checkbox}>
                                        <input
                                            type="checkbox"
                                            checked={sameAsShipping}
                                            onChange={(e) => setSameAsShipping(e.target.checked)}
                                        />
                                        <span>Same as shipping address</span>
                                    </label>

                                    {!sameAsShipping && (
                                        <div className={styles.billingForm}>
                                            <div className={styles.formGrid}>
                                                <Input
                                                    label="Full Name"
                                                    value={billingAddress.fullName}
                                                    onChange={(e) => setBillingAddress({ ...billingAddress, fullName: e.target.value })}
                                                    fullWidth
                                                    required
                                                />
                                                <Input
                                                    label="Phone Number"
                                                    type="tel"
                                                    value={billingAddress.phone}
                                                    onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                                                    fullWidth
                                                    required
                                                />
                                            </div>
                                            <Input
                                                label="Address"
                                                value={billingAddress.address}
                                                onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                                                fullWidth
                                                required
                                            />
                                            <div className={styles.formGrid}>
                                                <Input
                                                    label="City"
                                                    value={billingAddress.city}
                                                    onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                                                    fullWidth
                                                    required
                                                />
                                                <Input
                                                    label="State"
                                                    value={billingAddress.state}
                                                    onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                                                    fullWidth
                                                    required
                                                />
                                                <Input
                                                    label="Pincode"
                                                    value={billingAddress.pincode}
                                                    onChange={(e) => setBillingAddress({ ...billingAddress, pincode: e.target.value })}
                                                    fullWidth
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.actions}>
                                    <Button variant="outline" onClick={() => setStep('shipping')}>
                                        Back
                                    </Button>
                                    <Button variant="primary" size="lg" onClick={() => setStep('review')}>
                                        Review Order
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {/* Step 3: Review */}
                        {step === 'review' && (
                            <Card padding="lg">
                                <h2 className={styles.sectionTitle}>Review Your Order</h2>

                                <div className={styles.reviewSection}>
                                    <h3>Shipping Address</h3>
                                    <p>
                                        {shippingAddress.fullName}<br />
                                        {shippingAddress.phone}<br />
                                        {shippingAddress.address}<br />
                                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
                                    </p>
                                </div>

                                <div className={styles.reviewSection}>
                                    <h3>Payment Method</h3>
                                    <p>{paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</p>
                                </div>

                                <div className={styles.actions}>
                                    <Button variant="outline" onClick={() => setStep('payment')}>
                                        Back
                                    </Button>
                                    <Button variant="primary" size="lg" onClick={handlePlaceOrder} disabled={placing}>
                                        {placing ? 'Placing Order...' : 'Place Order'}
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <aside className={styles.sidebar}>
                        <Card padding="lg">
                            <h3 className={styles.summaryTitle}>Order Summary</h3>

                            <div className={styles.summaryItems}>
                                {cartItems.map((item) => (
                                    <div key={item.id} className={styles.summaryItem}>
                                        <div className={styles.summaryItemDetails}>
                                            <span className={styles.summaryItemTitle}>{item.name}</span>
                                            <span className={styles.summaryItemMeta}>
                                                Qty: {item.quantity}
                                            </span>
                                        </div>
                                        <span className={styles.summaryItemPrice}>
                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summaryDivider} />

                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>

                            <div className={styles.summaryRow}>
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                            </div>

                            <div className={styles.summaryRow}>
                                <span>Tax (GST 18%)</span>
                                <span>₹{tax.toLocaleString('en-IN')}</span>
                            </div>

                            <div className={styles.summaryDivider} />

                            <div className={styles.summaryTotal}>
                                <span>Total</span>
                                <span>₹{total.toLocaleString('en-IN')}</span>
                            </div>

                            <div className={styles.trustBadges}>
                                <div className={styles.trustBadge}>
                                    <span>🔒</span>
                                    <span>Secure Checkout</span>
                                </div>
                                <div className={styles.trustBadge}>
                                    <span>✓</span>
                                    <span>Certified Products</span>
                                </div>
                            </div>
                        </Card>
                    </aside>
                </div>
            </div>
        </div>
    )
}
