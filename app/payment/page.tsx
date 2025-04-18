'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Card, Typography, Radio, RadioGroup, FormControlLabel, FormControl, IconButton, Box, Divider } from '@mui/material';
import Image from 'next/image';
import { RootState } from '../redux/store';
import { convertToSubcurrency } from '../utils/convertToSubCurrency';
import StripeComponent from '../components/StripeComponent';
import PaypalComponent from '../components/PaypalComponent';
import { motion } from 'framer-motion';
import PaymentCheckoutCart from '../components/PaymentCheckoutCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { FoodItem } from '../utils/types/menu_type';
import PaymentCheckoutBill from '../components/PaymentCheckoutBill';
import { OrderType } from '../models/Order';
import PaymentIcon from '@mui/icons-material/Payment';

const Checkout = () => {
  const [amountInCents, setAmountInCents] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe' | null>(null);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [deliveryTip, setDeliveryTip] = useState<number | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<string | null>(null);
  const [isFreeDelivery, setFreeDelivery] = useState<boolean>(false);
  const [isStripeLoaded, setIsStripeLoaded] = React.useState(false);
  const stripeRef = useRef<HTMLDivElement | null>(null);
  const { cart } = useSelector((state: RootState) => state.cart);
  const foodItems: FoodItem[] = useSelector((state: RootState) => state.menu.foodMenuItems);
  const isMobileView = useSelector((state: RootState) => state.mobile.isMobile); // Responsive state
  const { customerOrder, customerDetails, isCustomerDetailsPresent } = useSelector(
    (state: RootState) => state.customerDetails,
  );

  useEffect(() => {
    const checkSessionStorage = () => {
      const tip = sessionStorage.getItem('tipAmount');
      if (tip && tip !== String(deliveryTip)) {
        setDeliveryTip(parseFloat(tip)); // Update the state with the new tip value
      }
      else if (!tip) {
        setDeliveryTip(null);
      }
    };

    // Initial load of the tip from sessionStorage
    checkSessionStorage();

    // Set up interval to check sessionStorage every 500ms
    const intervalId = setInterval(checkSessionStorage, 5);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [deliveryTip]);

  const filteredFoodItems = foodItems.filter((food) =>
    cart.some(cartItem => cartItem.itemId === food.id && cartItem.quantity > 0)
  );

  const router = useRouter();

  const onBack = () => {
    router.back();
  };

  useEffect(() => {
    if (isStripeLoaded) {
      // Delay scroll until after Stripe component has been fully loaded/rendered
      setTimeout(() => {
        stripeRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500); // Adjust delay if needed
    }
  }, [isStripeLoaded]); // Trigger scroll when Stripe component is loaded

  useEffect(() => {
    if (isCustomerDetailsPresent) {
      if (customerDetails?.deliveryFee) {
        setDeliveryFee(customerDetails.deliveryFee)
      }
      if (customerDetails?.isFreeDelivery) {
        setFreeDelivery(customerDetails.isFreeDelivery)
      }
    }
  }, [isCustomerDetailsPresent, customerDetails]);

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

  if (!loading && amountInCents <= 0 || (cart.length === 0 && filteredFoodItems.length === 0)) {
    return (
      <div className="flex items-center justify-center h-screen space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
    );
  }

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMethod = event.target.value as 'paypal' | 'stripe';
    setPaymentMethod(selectedMethod);
  };

  const isDeliveryOrder =
    (customerOrder && customerOrder.orderType === OrderType.DELIVERY) || false;

  return (
    <div className="flex items-center justify-center w-full mb-15">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`bg-white min-h-screen ${isMobileView ? 'w-screen p-4' : 'w-[850px]'}`}>
          {/* Title */}
          <div className="flex items-center justify-between mb-4">
            <IconButton onClick={onBack} aria-label="back">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" className="font-semibold flex-1 text-center">
              Checkout
            </Typography>
            <div className="w-10" />
          </div>

          {/* Order Summary */}
          <PaymentCheckoutCart foodItem={filteredFoodItems} cart={cart} />
          <Divider className="my-2" />
          <PaymentCheckoutBill
            isDeliveryOrder={isDeliveryOrder}
            cartTotal={cartTotal}
            deliveryFee={deliveryFee ?? ''}
            deliveryTip={deliveryTip !== null ? deliveryTip.toString() : ''}
            isFreeDelivery={isFreeDelivery}
          />
          <Divider className="my-2" />

          {/* Payment Method Selection */}
          <Box>
            <Typography variant="h6" className="font-semibold">
              <IconButton>
                <PaymentIcon fontSize="medium" className="text-gray-700" />
              </IconButton>
              Pay via
            </Typography>
            <Box sx={{ marginLeft: '20px', marginTop: '5px' }}>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  aria-label="payment-method"
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                  className="space-y-4"
                >
                  <FormControlLabel
                    value="paypal"
                    control={<Radio />}
                    label={
                      <span className="flex items-center gap-2">
                        <Image src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" width={24} height={24} />
                        Pay with PayPal
                      </span>
                    }
                  />
                  <FormControlLabel
                    value="stripe"
                    control={<Radio />}
                    label={
                      <span className="flex items-center gap-2">
                        <Image src="https://stripe.com/img/v3/home/twitter.png" alt="Stripe" width={24} height={24} />
                        Pay with Stripe
                      </span>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>

          {/* Payment Components */}
          <div className="ml-[10%] mt-8 mb-5 sm:ml-0">
            {paymentMethod === 'paypal' && amountInCents > 0 && cart.length > 0 && (
              <PaypalComponent amount={amountInCents} />
            )}
            {paymentMethod === 'stripe' && amountInCents > 0 && cart.length > 0 && (
               <div ref={stripeRef}>
              <StripeComponent amount={amountInCents} 
              onLoad={() => setIsStripeLoaded(true)}  // Set it to true once Stripe is loaded
               />
               </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Checkout;
