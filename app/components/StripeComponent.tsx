'use client'
import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
    Elements,
} from '@stripe/react-stripe-js';
import CheckoutPage from './CheckoutPage';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

interface StripeComponentProps{
    amount:number,
    onLoad: () => void 
}
const StripeComponent:React.FC<StripeComponentProps> = ({amount,onLoad}) => {
    return (
        <div className="flex justify-center items-center mt-8 overflow-x-auto"> {/* Add overflow-x-auto for scroll if needed */}
      <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%]"> {/* Container width responsive */}
        <Elements
          stripe={stripePromise}
          options={{
            mode: 'payment',
            amount: amount,
            currency: 'eur',
            locale: 'en',
          }}
        >
          <CheckoutPage amount={amount} onClientSecretLoad={onLoad}/>
        </Elements>
      </div>
    </div>
    )
}

export default StripeComponent
