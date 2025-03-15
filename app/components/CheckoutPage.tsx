'use client'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const CheckoutPage = ({ amount }: { amount: number }) => {
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
    }, [amount])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        if (!stripe || !elements) {
            return
        }
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: process.env.PAYMENT_SUCCESS_URL|| '',
            },
            
        })
        if (error) {
            setErrorMessage(error.message);
        } else {

        }
        setLoading(false)
    }

    if (!clientSecret || !stripe || !elements) {
        return (
            <div className="flex items-center justify-center">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                </div>
            </div>
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
    )
}

export default CheckoutPage
