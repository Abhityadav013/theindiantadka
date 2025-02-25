import { Box, Typography,Button } from '@mui/material'
import React from 'react'


//onClick={scrollToBillDetails}
const PaymentCheckout = () => {
  return (
    <Box className="mt-4 p-4 border rounded-lg bg-white shadow-md flex justify-between items-center">
    <Box>
      <Typography variant="h6" className="font-semibold">₹1770</Typography>
      <Typography variant="body2" className="text-blue-500 cursor-pointer">VIEW DETAILED BILL</Typography>
    </Box>
    <Button variant="contained" color="success" className="px-6 py-2 font-semibold">MAKE PAYMENT</Button>
  </Box>
  )
}

export default PaymentCheckout
