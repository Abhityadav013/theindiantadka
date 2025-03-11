'use client'
import React from 'react';
import { Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

const PaymentComponent = () => {
  const router = useRouter();

  // PayPal Button
  const handlePayPalPayment = () => {
    // Redirect to PayPal checkout
    router.push('/api/paypal');
  };

  // Stripe Button
  const handleStripePayment = async () => {
    return
    // const response = await fetch('/api/stripe-checkout', { method: 'POST' });
    // const session = await response.json();
    // const stripe = await import('');
    // const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
    // if (error) {
    //   console.error(error);
    // }
  };

  return (
    <Box className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Payment Options</h2>
      
      <Button
        variant="contained"
        color="primary"
        className="w-full"
        onClick={handlePayPalPayment}
      >
        Pay with PayPal
      </Button>
      
      <Button
        variant="contained"
        color="secondary"
        className="w-full"
        onClick={handleStripePayment}
      >
        Pay with Stripe
      </Button>

      {/* Add other payment methods like Klarna or SEPA */}
      <Button variant="outlined" color="info" className="w-full">
        Pay with Klarna (SEPA)
      </Button>
    </Box>
  );
};

export default PaymentComponent;
