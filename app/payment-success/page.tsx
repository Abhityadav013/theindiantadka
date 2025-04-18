'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { Cart } from '../utils/types/cart_type';

const PaymentSuccess = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const cart: Cart[] = useSelector((state: RootState) => state.cart.cart);
  const { customerOrder } = useSelector((state: RootState) => state.customerDetails);

  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const hasRunRef = useRef(false);

  // Create Order only once
  useEffect(() => {
    if (hasRunRef.current || !cart || cart.length === 0) return;

    const createOrder = async () => {
      try {
        const response = await fetch('/api/create-order-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderDetails: cart,
            orderType: customerOrder?.orderType,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          dispatch({ type: "cart/updateCartOrderCreatedSaga" });
          dispatch({ type: "cart/fetchCartSaga" });
          setIsOrderSuccess(true); // trigger countdown
        } else {
          throw new Error(data.message || 'Failed to create order');
        }
      } catch (error) {
        console.error('Error creating order:', error);
      }
    };

    hasRunRef.current = true;
    createOrder();
  }, [cart, customerOrder, dispatch]);

  // Start countdown when success is true
  useEffect(() => {
    if (!isOrderSuccess) return;

    setCountdown(5); // start from 5 seconds
  }, [isOrderSuccess]);

  // Countdown logic
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      router.push('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

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
        {countdown !== null && (
          <div className="mt-4 text-center text-sm text-gray-500">
            You will be redirected to the homepage in <span className="font-semibold">{countdown}</span> second{countdown !== 1 && 's'}...
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentSuccess;
