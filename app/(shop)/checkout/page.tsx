'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from './page.module.css'

export default function CheckoutPage() {
    const router = useRouter()
    const { user, isAuthenticated } = useAuth()
    const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping')

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=/checkout')
        }
    }, [isAuthenticated, router])

    // Form state
    const [email, setEmail] = useState(user?.email || '')
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    })
    const [billingAddress, setBillingAddress] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    })
    const [sameAsShipping, setSameAsShipping] = useState(true)
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online')

    // Mock cart data
    const cartItems = [
        {
            id: '1',
            title: 'iPhone 13 Pro 128GB',
            price: 45999,
            quantity: 1,
            condition_grade: 'A',
        },
    ]

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 50000 ? 0 : 200
    const tax = Math.round(subtotal * 0.18) // 18% GST
    const total = subtotal + shipping + tax

    const handlePlaceOrder = async () => {
        // TODO: Integrate with Supabase to create order
        console.log('Order data:', {
            email,
            shippingAddress,
            billingAddress: sameAsShipping ? shippingAddress : billingAddress,
            paymentMethod,
            items: cartItems,
            total,
        })

        // Redirect to success page
        router.push('/checkout/success?order=ORD-' + Date.now())
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

                                <div className={styles.formGrid}>
                                    <Input
                                        label="Full Name"
                                        placeholder="John Doe"
                                        value={shippingAddress.fullName}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                        fullWidth
                                    />
                                    <Input
                                        label="Phone Number"
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={shippingAddress.phone}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                        fullWidth
                                    />
                                </div>

                                <Input
                                    label="Address"
                                    placeholder="Street address, apartment, suite, etc."
                                    value={shippingAddress.address}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                    fullWidth
                                />

                                <div className={styles.formGrid}>
                                    <Input
                                        label="City"
                                        placeholder="Mumbai"
                                        value={shippingAddress.city}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        fullWidth
                                    />
                                    <Input
                                        label="State"
                                        placeholder="Maharashtra"
                                        value={shippingAddress.state}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                        fullWidth
                                    />
                                    <Input
                                        label="Pincode"
                                        placeholder="400001"
                                        value={shippingAddress.pincode}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                                        fullWidth
                                    />
                                </div>

                                <div className={styles.actions}>
                                    <Button variant="primary" size="lg" onClick={() => setStep('payment')}>
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
                                                />
                                                <Input
                                                    label="Phone Number"
                                                    type="tel"
                                                    value={billingAddress.phone}
                                                    onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                                                    fullWidth
                                                />
                                            </div>
                                            <Input
                                                label="Address"
                                                value={billingAddress.address}
                                                onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                                                fullWidth
                                            />
                                            <div className={styles.formGrid}>
                                                <Input
                                                    label="City"
                                                    value={billingAddress.city}
                                                    onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                                                    fullWidth
                                                />
                                                <Input
                                                    label="State"
                                                    value={billingAddress.state}
                                                    onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                                                    fullWidth
                                                />
                                                <Input
                                                    label="Pincode"
                                                    value={billingAddress.pincode}
                                                    onChange={(e) => setBillingAddress({ ...billingAddress, pincode: e.target.value })}
                                                    fullWidth
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
                                    <Button variant="primary" size="lg" onClick={handlePlaceOrder}>
                                        Place Order
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
                                            <span className={styles.summaryItemTitle}>{item.title}</span>
                                            <span className={styles.summaryItemMeta}>
                                                Grade {item.condition_grade} • Qty: {item.quantity}
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
