"use client";
import React, { useEffect, useRef, useState } from 'react';
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
import RestroSuggestion from '../components/RestroSuggestion';
import AddressSection from '../components/MobileView/AddressSection';
import BillDetails from '../components/MobileView/BillDetails';
import PaymentCheckout from '../components/MobileView/PaymentCheckout';
import ReviewOrderSection from '../components/MobileView/ReviewOrderSection';
import TipOptions from '../components/MobileView/TipOptions';

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const cart: Cart[] = useSelector((state: RootState) => state.cart.cart);
  const { userAddress } = useSelector((state: RootState) => state.address);
  const { isMobile } = useSelector((state: RootState) => state.mobile);
  const billDetailsRef = useRef<HTMLDivElement | null>(null);

  const scrollToBillDetails = () => {
    billDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Wait for 2 seconds before rendering

    return () => clearTimeout(timer);
  }, []);

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
        <CartSection />
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
        <Box> {/* Add margin to ensure CartItem is below CartSection */}
          <TipOptions />
        </Box>
        <Box ref={billDetailsRef}> {/* Add margin to ensure CartItem is below CartSection */}
          <BillDetails />
        </Box>
        <Box>
          <ReviewOrderSection />
        </Box>
        <Box>

        </Box>
        <Box sx={{ marginBottom: '20px' }}>

        </Box>
        {/* Add margin-top here to create spacing */}
        <Box sx={{ marginTop: '60px' }}>
          {
            userAddress?.length === 0 ?
              <AddAddressSection isMobile={isMobile} />
              :
              <>
                <AddressSection userAddress={userAddress} />
                <PaymentCheckout scrollToBillDetails={scrollToBillDetails} />
              </>}
        </Box>
      </Box>



    );
  }
};

export default Checkout;
