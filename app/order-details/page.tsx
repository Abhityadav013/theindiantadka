"use client";
import React, { useEffect, useState } from 'react';
import LoginSection from '../components/MobileLogin/LoginSection';
import { Cart } from '../utils/types/cart_type';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import FakeSection from '../components/MobileView/FakeCheckout';
import CartSection from '../components/MobileView/CartSection';
import CartItem from '../components/MobileView/CartItem';
import { Box } from '@mui/material';
// import NoContactDelivery from '../components/MobileView/NoContactDelivery';
import TipOptions from '../components/MobileView/TipOptions';
import BillDetails from '../components/MobileView/BillDetails';
import ReviewOrderSection from '../components/MobileView/ReviewOrderSection';
import PaymentCheckout from '../components/MobileView/PaymentCheckout';
import Loader from '../components/Loader';
import AddAddressSection from '../components/MobileView/AddAddress';
import AddressSection from '../components/MobileView/AddressSection';

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const cart: Cart[] = useSelector((state: RootState) => state.cart.cart);
  const { profile, loginModal } = useSelector((state: RootState) => state.user);
  const { userAddress } = useSelector((state: RootState) => state.address);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Wait for 2 seconds before rendering

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader loadingImage={'https://D17B2bEFA637skvB.public.blob.vercel-storage.com/cart-item-loader.gif'} isLoading={isLoading} />
      </Box>
    );
  }

  if (cart.length === 0) {
    return <FakeSection />;
  } else {
    return (
      <Box sx={{ paddingBottom: profile.name !=='' ?  '140px' :'10px' }}> {/* Add padding to the bottom */}
        <CartSection />
        <Box className="mt-20"> {/* Add margin to ensure CartItem is below CartSection */}
          <CartItem />
        </Box>
        {/* <Box className="mt-4 bg-gradient-to-b from-[#fffbf5] to-[#fff7f4] border-tomato"
          sx={{
            border: "1px solid #ff5200", // 🔥 Updated border color
            borderRadius: "4px"
          }}>
          <NoContactDelivery />
        </Box> */}
        <Box> {/* Add margin to ensure CartItem is below CartSection */}
          <TipOptions />
        </Box>
        <Box> {/* Add margin to ensure CartItem is below CartSection */}
          <BillDetails />
        </Box>
        <Box>
          <ReviewOrderSection />
        </Box>
        {
          profile.name !== '' ? (
            <Box>
              {
                userAddress?.length === 0 ? <AddAddressSection />
                  : (
                    <>
                      <AddressSection userAddress={userAddress}/>
                      <PaymentCheckout />
                    </>
                  )
              }
            </Box>
          ) : <LoginSection />
        }
        {loginModal && <LoginSection />} {/* Conditionally render LoginDrawer */}
      </Box>
    );
  }
};

export default Checkout;
