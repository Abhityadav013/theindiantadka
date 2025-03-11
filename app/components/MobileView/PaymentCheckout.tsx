import { RootState } from '@/app/redux/reducers';
import { Box, Typography,Button } from '@mui/material'
import { useRouter } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';


//onClick={scrollToBillDetails}
const PaymentCheckout = () => {
  const { cartTotal } = useSelector((state: RootState) => state.cart);
    const router = useRouter();
  
    // PayPal Button
    const handlePayPalPayment = () => {
      // Redirect to PayPal checkout
      router.push('/payment');
    };
  return (
    <Box className="mt-4 p-4 border rounded-lg bg-white shadow-md flex justify-between items-center">
    <Box>
      <Typography variant="h6" className="font-semibold">€{cartTotal}</Typography>
      <Typography variant="body2" className="text-blue-700 text-xs cursor-pointer">VIEW DETAILED BILL</Typography>
    </Box>
    <Button variant="contained" color="success" className="py-2 font-semibold"onClick={handlePayPalPayment}>MAKE PAYMENT</Button>
  </Box>
  )
}

export default PaymentCheckout
