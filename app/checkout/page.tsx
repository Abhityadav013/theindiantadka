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
import CartHistory from '../components/CartHistory';

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
      <Box> {/* Add padding to the bottom */}
        <CartSection />
        {/* Cart Item Section with fixed height and scroll */}
        <Box className={!isMobile ? `max-w-6xl mx-auto flex justify-between gap-4 bg-white` : ''}>
          {
            isMobile ?
              (<Box className="mt-20">
                <CartItem />
              </Box>) :
              (
                <div className="mt-20">
                  <CartHistory />
                </div>
              )
          }
          <Box sx={{marginBottom:'20px'}}>
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
            <Box>
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
        </Box>
      </Box>
    );
  }
};

export default Checkout;
