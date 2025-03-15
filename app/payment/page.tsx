'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// Adjust path as needed
import StripeComponent from '../components/StripeComponent';
import { Button, Card, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import SvgIcon from '@mui/material/SvgIcon';
import { RootState } from '../redux/store';
import { useRouter } from 'next/navigation';
import { convertToSubcurrency } from '../utils/convertToSubCurrency';
import PaypalComponent from '../components/PaypalComponent';

const PayPalIcon = (props: React.ComponentProps<typeof SvgIcon>) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path fill="#003087" d="M23.18 6.19c-.32-1.23-1.2-2.2-2.41-2.62C19.48 3.24 17.6 3 15.21 3H7.4c-.48 0-.91.34-1 .82L3.1 20.4c-.1.55.31 1.06.87 1.06h4.64l.84-4.52c.09-.48.52-.83 1.01-.83h2.53c3.78 0 6.73-1.52 7.6-5.9.26-1.26.24-2.31-.02-3.32z" />
  </SvgIcon>
);

const StripeIcon = (props: React.ComponentProps<typeof SvgIcon>) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path fill="#6772E5" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.14 13.96c-.83.38-1.97.7-3.35.7-3.2 0-5.27-1.96-5.27-5 0-3.17 2.16-5.2 5.54-5.2 1.22 0 2.5.25 3.17.55l-.53 2.42c-.53-.22-1.25-.44-2.1-.44-1.39 0-2.44.85-2.44 2.42 0 1.5.92 2.42 2.7 2.42.67 0 1.36-.13 1.91-.35l.37 2.48z" />
  </SvgIcon>
);

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe'>('paypal');
  const [amountInCents, setAmountInCents] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const isMobileView = useSelector((state: RootState) => state.mobile.isMobile); // Responsive state
  const { cartTotal } = useSelector((state: RootState) => state.cart);
  const router = useRouter()

  useEffect(() => {
    if (cartTotal <= 0) {
      if (isMobileView) {
        router.push("/checkout");
      } else {
        router.push("/checkout");
      }
    }
  }, [cartTotal, isMobileView, router]);



  useEffect(() => {
    // Convert the amount to cents when the component mounts or when 'amount' changes
    const fetchAmountInCents = async () => {
      const convertedAmount = await convertToSubcurrency(cartTotal);
      setAmountInCents(convertedAmount);  // Set the converted value to state
      setLoading(true)
    };

    fetchAmountInCents();
  }, [cartTotal]);  // This effect will run whenever 'amount' changes
  
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
            variant={paymentMethod === 'paypal' ? 'contained' : 'outlined'}
            color="primary"
            startIcon={<PayPalIcon />}
            onClick={() => setPaymentMethod('paypal')}
          >
            Pay with PayPal
          </Button>

          <Button
            fullWidth={isMobileView}
            variant={paymentMethod === 'stripe' ? 'contained' : 'outlined'}
            color="secondary"
            startIcon={<StripeIcon />}
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
          {paymentMethod === 'paypal' ? <PaypalComponent amount={amountInCents} /> : <StripeComponent amount={amountInCents} />}
        </motion.div>
      </Card>
    </div>
  );
};

export default Checkout;
