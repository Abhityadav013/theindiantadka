'use client'
import React, { useEffect } from 'react';
import { Button, Card, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { Cart } from '../utils/types/cart_type';

const PaymentSuccess = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const cart: Cart[] = useSelector((state: RootState) => state.cart.cart);
   const { customerOrder } = useSelector(
      (state: RootState) => state.customerDetails,
    );
  useEffect(() => {
    // Assuming you have some payment status to check if payment is successful.
    const paymentSuccessful = true; // Replace with actual check logic

    if (paymentSuccessful) {
      const createOrder = async () => {
        try {
          const response = await fetch('/api/create-order-success', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderDetails: cart,
              orderType: customerOrder?.orderType, // Assuming this is the correct value for your order type
            }),
          });

          const data = await response.json();
          if (response.ok) {
            // Order creation successful
            dispatch({ type: "cart/updateCartOrderCreatedSaga" });
          } else {
            throw new Error(data.message || 'Failed to create order');
          }
        } catch (error) {
          console.error('Error creating order:', error);
        }
      };

      createOrder();

      // Redirect to the home page after 5 seconds
      const timer = setTimeout(() => {
        router.push('/');
      }, 5000);

      // Clean up the timer when the component unmounts
      return () => clearTimeout(timer);
    } else {
      console.error('Payment was not successful');
    }
  }, [cart, dispatch,customerOrder, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-8 shadow-xl rounded-xl bg-white max-w-lg w-full">
        <Typography variant="h4" component="h1" className="text-green-500 text-center mb-4">
          Payment Successful!
        </Typography>
        <Typography variant="body1" component="p" className="text-gray-600 text-center mb-6">
          Thank you for your purchase. Your payment has been processed successfully.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/')}
          className="w-full mt-4"
        >
          Go to Home
        </Button>
        <div className="mt-4 text-center text-sm text-gray-500">
          You will be redirected to the homepage shortly...
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
