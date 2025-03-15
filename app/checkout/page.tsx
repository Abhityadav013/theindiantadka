"use client";
import React, { useRef } from 'react';
import { Box } from '@mui/material';
import TipOptions from '../components/MobileView/TipOptions';
import BillDetails from '../components/MobileView/BillDetails';
import ReviewOrderSection from '../components/MobileView/ReviewOrderSection';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AddressSection from '../components/MobileView/AddressSection';
import PaymentCheckout from '../components/MobileView/PaymentCheckout';
import CartSection from '../components/MobileView/CartSection';
// import CartHistory from '../components/CartHistory';
//import CartSection from '../components/MobileView/CartSection';


const Checkout = () => {
  const billDetailsRef = useRef<HTMLDivElement | null>(null);
  const { userAddress } = useSelector((state: RootState) => state.address);

  const scrollToBillDetails = () => {
    billDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <Box>
      <CartSection title={'Checkout'} />
      <div className='mb-20' />
      {/* <div className="w-1/3 mt-6">
        <CartHistory />
      </div> */}
      <Box>
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
          <AddressSection userAddress={userAddress} />
        </Box>
        <Box sx={{marginBottom:'20px'}}>
          <PaymentCheckout scrollToBillDetails={scrollToBillDetails} />
        </Box>
      </Box>
    </Box>

  );
};

export default Checkout;
