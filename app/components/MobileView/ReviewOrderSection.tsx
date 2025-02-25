import { Box, Typography } from '@mui/material'
import React from 'react'
import ReceiptIcon from "@mui/icons-material/Receipt";
const ReviewOrderSection = () => {
  return (
    <Box className="mt-4 p-4 border rounded-lg bg-white shadow-md">
        <Typography variant="h6" className="font-semibold flex items-center">
          <ReceiptIcon className="mr-2 text-gray-700" /> Review your order and address details to avoid cancellations
        </Typography>
        <Typography variant="body2" className="text-gray-600 mt-2">
          <strong>Note:</strong> Please ensure your address and order details are correct. This order, if cancelled, is non-refundable.
        </Typography>
        <Typography variant="body2" className="text-orange-500 mt-2 cursor-pointer">Read policy</Typography>
      </Box>
  )
}

export default ReviewOrderSection
