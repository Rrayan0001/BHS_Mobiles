import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

interface CheckoutAddress {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
}

const CHECKOUT_DEFAULT_ADDRESS_ID = 'checkout-default-address'
const REQUIRED_ADDRESS_FIELDS: Array<keyof CheckoutAddress> = [
    'fullName',
    'phone',
    'address',
    'city',
    'state',
    'pincode'
]

function readText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : ''
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

function isTruthyDefault(value: unknown): boolean {
    return value === true || value === 'true'
}

function normalizeCheckoutAddress(input: unknown): CheckoutAddress {
    const source = isRecord(input) ? input : {}

    return {
        fullName: readText(source.fullName) || readText(source.name),
        phone: readText(source.phone),
        address: readText(source.address) || readText(source.line1),
        city: readText(source.city),
        state: readText(source.state),
        pincode: readText(source.pincode),
    }
}

function validateCheckoutAddress(address: CheckoutAddress): string | null {
    for (const field of REQUIRED_ADDRESS_FIELDS) {
        if (!address[field]) {
            return `Shipping ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`
        }
    }

    const phoneDigits = address.phone.replace(/[^0-9]/g, '')
    if (phoneDigits.length < 10) {
        return 'Please enter a valid 10-digit phone number'
    }

    const pincodeDigits = address.pincode.replace(/[^0-9]/g, '')
    if (pincodeDigits.length !== 6) {
        return 'Please enter a valid 6-digit pincode'
    }

    return null
}

function toStoredAddress(address: CheckoutAddress): Record<string, string | boolean> {
    return {
        id: CHECKOUT_DEFAULT_ADDRESS_ID,
        name: address.fullName,
        fullName: address.fullName,
        phone: address.phone,
        line1: address.address,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        is_default: true
    }
}

function pickSavedCheckoutAddress(addresses: unknown): CheckoutAddress | null {
    if (!Array.isArray(addresses)) {
        return null
    }

    const validAddresses = addresses.filter(isRecord)
    if (validAddresses.length === 0) {
        return null
    }

    const preferredAddress =
        validAddresses.find((address) => readText(address.id) === CHECKOUT_DEFAULT_ADDRESS_ID)
        ?? validAddresses.find((address) => isTruthyDefault(address.is_default))
        ?? validAddresses[0]

    const normalized = normalizeCheckoutAddress(preferredAddress)
    const hasAnyData = Object.values(normalized).some((value) => value.length > 0)

    return hasAnyData ? normalized : null
}

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: userProfile, error } = await supabaseAdmin
            .from('users')
            .select('addresses')
            .eq('email', user.email)
            .maybeSingle()

        if (error) {
            console.error('Saved address fetch error:', error)
            return NextResponse.json({ error: 'Failed to fetch saved address' }, { status: 500 })
        }

        return NextResponse.json({
            address: pickSavedCheckoutAddress(userProfile?.addresses ?? null)
        }, { status: 200 })
    } catch (error) {
        console.error('Saved address API GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const address = normalizeCheckoutAddress(body?.address)
        const validationError = validateCheckoutAddress(address)

        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 })
        }

        const { data: existingUser, error: existingUserError } = await supabaseAdmin
            .from('users')
            .select('addresses')
            .eq('email', user.email)
            .maybeSingle()

        if (existingUserError) {
            console.error('User profile fetch error:', existingUserError)
            return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 })
        }

        const existingAddresses = Array.isArray(existingUser?.addresses)
            ? existingUser.addresses.filter(isRecord)
            : []

        const mergedAddresses = [
            toStoredAddress(address),
            ...existingAddresses
                .filter((existingAddress) => readText(existingAddress.id) !== CHECKOUT_DEFAULT_ADDRESS_ID)
                .map((existingAddress) => ({ ...existingAddress, is_default: false }))
        ]

        const { error: upsertError } = await supabaseAdmin
            .from('users')
            .upsert({
                id: user.id,
                email: user.email,
                name: address.fullName,
                phone: address.phone,
                addresses: mergedAddresses
            }, { onConflict: 'email' })

        if (upsertError) {
            console.error('User address upsert error:', upsertError)
            return NextResponse.json({ error: 'Failed to save address' }, { status: 500 })
        }

        return NextResponse.json({ success: true, address }, { status: 200 })
    } catch (error) {
        console.error('Saved address API PUT error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
