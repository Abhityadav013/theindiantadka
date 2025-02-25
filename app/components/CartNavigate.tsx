'use client'
import React from 'react'
import { Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';

const CartNavigate = () => {
    const router = useRouter(); // Initialize router
    const isMobileView = useSelector((state: RootState) => state.mobile.isMobile);

    const handleNavigate = () => {
      router.push(isMobileView ? "/checkout" : "/cart"); // Navigate to cart page
    };
  return (
    <Button
    variant="contained"
    className="!bg-white !text-green-600 hover:!bg-gray-100"
    startIcon={<ShoppingCartIcon />}
    onClick={handleNavigate} // Handle navigation
  >
    View Cart
  </Button>
  )
}

export default CartNavigate
