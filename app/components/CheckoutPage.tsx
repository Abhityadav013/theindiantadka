'use client'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {  CircularProgress, Box } from '@mui/material';

interface StripeCheckoutProps{
    amount:number,
}

const CheckoutPage:React.FC<StripeCheckoutProps> = ({amount}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const isMobileView = useSelector((state: RootState) => state.mobile.isMobile);

    useEffect(() => {
        fetch("api/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount: amount })
        })
            .then(res => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, [amount]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log('Stripe Payment')
        event.preventDefault();
        setLoading(true);
        if (!stripe || !elements) {
            return;
        }
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
        }

        const response = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: 'https://theindiantadka.vercel.app/payment-success',
            },
        });
        console.log('Stripe DOne',response)
        if (response.error) {
            setErrorMessage(response.error.message);
        } else {
            // Payment successful logic here (e.g., redirect to success page)
        }
        setLoading(false);
    };
    

    if (!clientSecret || !stripe || !elements) {
        return (
            <Box className="flex items-center justify-center">
                <CircularProgress size={50} />
            </Box>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={`p-2 rounded-md ${isMobileView ? 'max-w-sm w-full' : 'max-w-md w-full'}`}>
        {clientSecret && <PaymentElement />}
        {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
        <button 
            disabled={!stripe || loading} 
            className={`w-full p-4 mt-4 rounded-md font-bold ${isMobileView ? 'text-lg py-3' : 'text-xl py-4'} ${loading ? 'bg-gray-400' : 'bg-black text-white'}`}>
            {!loading ? `Pay ${amount / 100} €` : "Processing..."}
        </button>
    </form>
    );
};

export default CheckoutPage;
