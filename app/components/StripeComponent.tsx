'use client'
import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
    Elements,
} from '@stripe/react-stripe-js';
import CheckoutPage from './CheckoutPage';

if (process.env.STRIPE_PUBLIC_KEY === undefined) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined')
}

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY)
const StripeComponent = ({ amount }: { amount: number }) => {
    return (
        <div>
            <Elements
                stripe={stripePromise}
                options={{
                    mode: 'payment',
                    amount: amount,
                    currency: 'eur',
                    locale:'en',
                }}>
                <CheckoutPage amount={amount} />
            </Elements>
        </div>
    )
}

export default StripeComponent
