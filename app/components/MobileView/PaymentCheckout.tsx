import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface PaymentCheckoutProps {
  scrollToBillDetails: () => void; // Function to scroll to Bill Details
}

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({ scrollToBillDetails }) => {
  const router = useRouter();
  const [cartTotal, setCartTotal] = useState<number | null>(null);

  useEffect(() => {
    const checkCartTotalAmount = () => {
      const cartAmount = sessionStorage.getItem('cartTotalAmount');
      if (cartAmount) {
        setCartTotal(Number(cartAmount));
      }
    };

    // Initial load of the tip from sessionStorage
    checkCartTotalAmount();

    // Set up interval to check sessionStorage every 500ms
    const intervalId = setInterval(checkCartTotalAmount, 5);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [cartTotal]);

  // PayPal Button
  const handlePayPalPayment = () => {
    router.push('/payment');
  };

  return (
    <Box className="mt-4 p-4 border rounded-lg bg-white shadow-md flex">
      <Box>
        <Typography variant="h6" className="font-semibold">€{cartTotal}</Typography>
        {/* Call scrollToBillDetails instead of just setting state */}
        <Button variant="text" className="text-blue-700 text-xs cursor-pointer" onClick={scrollToBillDetails}>
          VIEW DETAILED BILL
        </Button>
      </Box>
      <Button variant="contained" color="success" className="py-2 font-semibold" onClick={handlePayPalPayment}>
        MAKE PAYMENT
      </Button>
    </Box>
  );
};

export default PaymentCheckout;
