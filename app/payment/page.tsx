'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaypal, faStripe } from '@fortawesome/free-brands-svg-icons';
import StripeComponent from '../components/StripeComponent';
import { Button, Card, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { RootState } from '../redux/store';
import { convertToSubcurrency } from '../utils/convertToSubCurrency';
import PaypalComponent from '../components/PaypalComponent';
import { Cart } from '../utils/types/cart_type';
import { FoodItem } from '../utils/types/menu_type';
import { Order } from '../utils/types/order_type';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe'>('paypal');
  const [amountInCents, setAmountInCents] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const isMobileView = useSelector((state: RootState) => state.mobile.isMobile); // Responsive state
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [order, setOrder] = useState<Order[]>([]);
  const { cart } = useSelector((state: RootState) => state.cart);
  const foodItems: FoodItem[] = useSelector((state: RootState) => state.menu.foodMenuItems);

  useEffect(() => {
    const checkCartTotalAmount = () => {
      const cartAmount = sessionStorage.getItem('cartTotalAmount');
      if (cartAmount) {
        setCartTotal(Number(cartAmount));
      }
    };

    // Initial load of the tip from sessionStorage
    checkCartTotalAmount();


  }, [cartTotal]);


  useEffect(() => {
    // Convert the amount to cents when the component mounts or when 'amount' changes
    const fetchAmountInCents = async () => {
      const convertedAmount = await convertToSubcurrency(cartTotal);
      setAmountInCents(convertedAmount);  // Set the converted value to state
      setLoading(true)
    };

    fetchAmountInCents();
  }, [cartTotal]);  // This effect will run whenever 'amount' changes

  useEffect(() => {
    if (cart.length > 0 && foodItems.length > 0) {
      const cartOrder = createOrder(cart, foodItems);
      setOrder(cartOrder);
    }
  }, [cart, foodItems]); // Only depend on cart and foodItems

  const createOrder = (cart: Cart[], foodItems: FoodItem[]) => {
    return cart.reduce((accumulator: Order[], cartItem) => {
      // Find the food item from foodItems array that matches the cart's itemId
      const foodItem = foodItems.find(item => item.id === cartItem.itemId);

      // If food item is found, add it to the accumulator
      if (foodItem) {
        accumulator.push({
          id: foodItem.id,
          itemName: foodItem.itemName,
          quantity: cartItem.quantity,
          price: foodItem.price * cartItem.quantity // price based on quantity
        });
      }

      // Return the accumulator at the end of each iteration
      return accumulator;
    }, []); // Initialize the accumulator as an empty array
  };

  if (!loading && amountInCents <= 0) {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className={`p-6 shadow-lg rounded-2xl bg-white ${isMobileView ? 'w-full max-w-sm' : 'w-full max-w-md'}`}>
        <Typography variant="h5" align="center" gutterBottom>
          Checkout
        </Typography>

        {/* Dynamic Button Layout: Stack on Mobile, Row on Desktop */}
        <Stack direction={isMobileView ? 'column' : 'row'} spacing={2} className="my-4">
          <Button
            fullWidth={isMobileView}
            startIcon={<FontAwesomeIcon icon={faPaypal} />}
            variant={paymentMethod === 'paypal' ? 'contained' : 'outlined'}
            color="primary"
            // startIcon={<PayPalIcon />}
            onClick={() => setPaymentMethod('paypal')}
          >
            Pay with PayPal
          </Button>

          <Button
            fullWidth={isMobileView}
            variant={paymentMethod === 'stripe' ? 'contained' : 'outlined'}
            color="secondary"
            startIcon={<FontAwesomeIcon icon={faStripe} />}
            onClick={() => setPaymentMethod('stripe')}
          >
            Pay with Stripe
          </Button>
        </Stack>

        {/* Animated Payment Component */}
        <motion.div
          key={paymentMethod}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {paymentMethod === 'paypal' ? <PaypalComponent amount={amountInCents} order={order} /> : <StripeComponent amount={amountInCents} />}
        </motion.div>
      </Card>
    </div>
  );
};

export default Checkout;
