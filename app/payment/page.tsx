'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { AppDispatch, RootState } from '../redux/store';
import { convertToSubcurrency } from '../utils/convertToSubCurrency';
import StripeComponent from '../components/StripeComponent';
import PaypalComponent from '../components/PaypalComponent';
import { OrderType } from '../models/Order';
import { Cart } from '../utils/types/cart_type';

const Checkout = () => {
  const [amountInCents, setAmountInCents] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe' | null>(null);
  const isMobileView = useSelector((state: RootState) => state.mobile.isMobile); // Responsive state
  const [cartTotal, setCartTotal] = useState<number>(0);
  const cart:Cart[] = useSelector((state: RootState) => state.cart.cart);
  const dispatch =useDispatch<AppDispatch>();

  useEffect(() => {
    const checkCartTotalAmount = () => {
      const cartAmount = sessionStorage.getItem('cartTotalAmount');
      if (cartAmount) {
        setCartTotal(Number(cartAmount));
      }
    };
    checkCartTotalAmount();
  }, [cartTotal]);

  useEffect(() => {
    const fetchAmountInCents = async () => {
      const convertedAmount = await convertToSubcurrency(cartTotal);
      setAmountInCents(convertedAmount);  // Set the converted value to state
      setLoading(true);
    };

    fetchAmountInCents();
  }, [cartTotal]);

  if (!loading && amountInCents <= 0) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !-h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value as 'paypal' | 'stripe');
  };

  const createOrder = async () => {
    try {
      const response = await fetch('/api/create-order-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderDetails: cart,
          orderType: OrderType.ONLINE,
          paymentMethod: 'PayPal'
        }),
      });

      const data = await response.json();
      if (response.ok) {
        dispatch({ type: "cart/updateCartOrderCreatedSaga" });
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating PayPal order:', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className={`p-6 shadow-lg rounded-2xl bg-white ${isMobileView ? 'w-full max-w-sm' : 'w-full max-w-md'}`}>
        <Typography variant="h5" align="center" gutterBottom>
          Checkout
        </Typography>

        {/* Payment Method Selection */}
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="payment-method"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            row
          >
            <FormControlLabel
              value="paypal"
              control={<Radio />}
              label="Pay with PayPal"
            />
            <FormControlLabel
              value="stripe"
              control={<Radio />}
              label="Pay with Stripe"
            />
          </RadioGroup>
        </FormControl>

        {/* Show PayPal or Stripe based on selection */}
        {
          paymentMethod === 'paypal' && amountInCents > 0 && cart.length > 0 && (
            <PaypalComponent amount={amountInCents} createOrder={createOrder} />
          )
        }

        {
          paymentMethod === 'stripe' && amountInCents > 0 && cart.length > 0 && (
            <StripeComponent amount={amountInCents} createOrder={createOrder} />
          )
        }
      </Card>
    </div>
  );
};

export default Checkout;
