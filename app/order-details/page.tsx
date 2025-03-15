"use client";
import React, { useEffect, useState } from 'react';
import { Cart } from '../utils/types/cart_type';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import FakeSection from '../components/MobileView/FakeCheckout';
import CartSection from '../components/MobileView/CartSection';
import CartItem from '../components/MobileView/CartItem';
import { Box } from '@mui/material';
// import NoContactDelivery from '../components/MobileView/NoContactDelivery';
import Loader from '../components/Loader';
import AddAddressSection from '../components/MobileView/AddAddress';
import ProceedSection from '../components/Proceed';
import RestroSuggestion from '../components/RestroSuggestion';
import Image from 'next/image';

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const cart: Cart[] = useSelector((state: RootState) => state.cart.cart);
  const { userAddress } = useSelector((state: RootState) => state.address);
  const { isMobile } = useSelector((state: RootState) => state.mobile);
  const [cartHeight, setCartHeight] = useState(0);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Wait for 2 seconds before rendering

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cartSection = document.getElementById('cart-items-section');
    if (cartSection) {
      setCartHeight(cartSection.offsetHeight);
    }
  }, [cart,isLoading]); // Runs whenever the cart updates

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader loadingImage={'https://testing.indiantadka.eu/assets/cart-item-loader.gif'} isLoading={isLoading} />
      </Box>
    );
  }

  if (cart.length === 0) {
    return <FakeSection />;
  } else {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CartSection title={'Your Cart'} />

        {/* Cart Item Section with fixed height and scroll */}
        <Box
          sx={{
            maxHeight: '40vh',
            overflowY: 'auto',
            padding: '8px',
            marginTop: '50px',
            scrollbarWidth: 'none', // Hide scrollbar for Firefox
            '&::-webkit-scrollbar': { display: 'none' } // Hide scrollbar for Chrome, Safari, Edge
          }}
          id="cart-items-section" // Add an ID to reference it later
        >
          <CartItem />
        </Box>
        <Box>
          <RestroSuggestion />
        </Box>

        {/* Image Section */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: ((cartHeight < window.innerHeight * 0.3 && cartHeight === 166) || userAddress?.length > 0)? '380px' : '220px',
            marginTop: '20px'
          }}>
          <Image
            src="https://testing.indiantadka.eu/assets/food_preparing.gif"
            alt="Food is preparing"
            layout="fill"
            objectFit="contain" // Ensures image is fully visible
          />
        </Box>

        {/* Add margin-top here to create spacing */}
        <Box sx={{ marginTop: '60px' }}>
          {userAddress?.length === 0 ? <AddAddressSection isMobile={isMobile} /> : <ProceedSection />}
        </Box>
      </Box>



    );
  }
};

export default Checkout;
