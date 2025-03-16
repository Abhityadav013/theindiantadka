'use client'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Button, CircularProgress, Box, Typography } from '@mui/material';

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
    }, [amount]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: 'https://theindiantadka.vercel.app/payment-success',
            },
        });
        if (error) {
            setErrorMessage(error.message);
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
        <form onSubmit={handleSubmit} className={`p-4 rounded-md ${isMobileView ? 'max-w-sm w-full' : 'max-w-md w-full'}`}>
            {clientSecret && <PaymentElement />}
            {errorMessage && <Typography variant="body2" color="error" className="mt-2">{errorMessage}</Typography>}
            <Box className="flex flex-col gap-4 mt-3">
                <Button
                    variant="contained"
                    disabled={!stripe || loading}
                    className={`w-full font-bold ${isMobileView ? 'text-lg py-3' : 'text-xl py-4'} ${loading ? 'bg-gray-400' : 'bg-black'}`}
                >
                    {!loading ? `Pay ${amount / 100} €` : "Processing..."}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    disabled={!stripe || loading}
                    className={`w-full font-bold ${isMobileView ? 'text-lg py-3' : 'text-xl py-4'}`}
                >
                    {!loading ? `Cancel` : "Processing..."}
                </Button>
            </Box>
        </form>
    );
};

export default CheckoutPage;
