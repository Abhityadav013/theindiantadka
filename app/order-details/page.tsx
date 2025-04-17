"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Cart } from '../utils/types/cart_type';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import FakeSection from '../components/MobileView/FakeCheckout';
import CartSection from '../components/MobileView/CartSection';
import CartItem from '../components/MobileView/CartItem';
import { Box } from '@mui/material';
// import NoContactDelivery from '../components/MobileView/NoContactDelivery';
import Loader from '../components/Loader';
import AddAddressSection from '../components/MobileView/AddAddress';
import RestroSuggestion from '../components/RestroSuggestion';
import BillDetails from '../components/MobileView/BillDetails';
import PaymentCheckout from '../components/MobileView/PaymentCheckout';
import ReviewOrderSection from '../components/MobileView/ReviewOrderSection';
import TipOptions from '../components/MobileView/TipOptions';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '../redux/store';
import { openCustomerDetailsModel } from '../redux/reducers/customerDetailsReducer';
import { OrderType } from '../models/Order';
import Image from 'next/image';
import CartHistory from '../components/CartHistory';
import CustomerContactDetails from '../components/MobileView/CustomerContatcDetail';
import { UserAddress } from '../utils/types/address_type';

const images = [
  'https://testing.indiantadka.eu/assets/DiscountImage1.jpg',
  'https://testing.indiantadka.eu/assets/DiscountImage2.jpg',
  'https://testing.indiantadka.eu/assets/DiscountImage3.jpg',
];


const Checkout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState<string | null>(null);
  const [isFreeDelivery, setFreeDelivery] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cart: Cart[] = useSelector((state: RootState) => state.cart.cart);
  const { isMobile } = useSelector((state: RootState) => state.mobile);
  const { customerDetails, customerOrder, isCustomerDetailsPresent } = useSelector(
    (state: RootState) => state.customerDetails,
  );
  const billDetailsRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter()

  const dispatch = useDispatch<AppDispatch>();

  const handleUserDetailModal = () => {
    dispatch(openCustomerDetailsModel())
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const scrollToBillDetails = () => {
    billDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (isCustomerDetailsPresent) {
      if (customerDetails?.deliveryFee) {
        setDeliveryFee(customerDetails.deliveryFee)
      }
      if (customerDetails?.isFreeDelivery) {
        setFreeDelivery(customerDetails.isFreeDelivery)
      }
      if (customerDetails?.notDeliverable) {
        router.push('/delivery-error')
      }
    }
  }, [isCustomerDetailsPresent, customerDetails, router])

  const isDeliveryOrder =
    (customerOrder && customerOrder.orderType === OrderType.DELIVERY) || false;

    const showDeliverySections =
    !isCustomerDetailsPresent || // Show when no customer details yet
    (isCustomerDetailsPresent && isDeliveryOrder); // Or it's a delivery order


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
      <Box>
        {' '}
        {/* Add padding to the bottom */}
        <CartSection />
        {/* Cart Item Section with fixed height and scroll */}
        <Box
          className={
            !isMobile
              ? `max-w-8xl mx-auto flex gap-4 space-around bg-white`
              : ''
          }
        >
          {isMobile ? (
            <Box className="mt-20">
              <CartItem />
            </Box>
          ) : (
            <Box className="mt-20" sx={{ width: '40%' }}>
              <CartHistory />
            </Box>
          )}
          <Box
            sx={{
              ...(!isMobile && {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
              }),
              marginBottom: '20px',
            }}
          >
            <Box>
              <Box>
                <RestroSuggestion />
              </Box>


              <Box ref={billDetailsRef}>
                {' '}
                {/* Add margin to ensure CartItem is below CartSection */}
                <BillDetails isDeliveryOrder={isDeliveryOrder} isFreeDelivery={isFreeDelivery} deliveryFee={deliveryFee ?? null} />
              </Box>

              {showDeliverySections && (
                <Box>
                  <ReviewOrderSection />
                </Box>
              )}
              {
                !isLoading && isCustomerDetailsPresent && (
                  <Box>
                    <CustomerContactDetails isDeliveryOrder={isDeliveryOrder} onEdit={handleUserDetailModal} customerName={customerDetails?.name ?? ''} customerPhone={customerDetails?.phoneNumber ?? ''} customerAddress={customerDetails?.address ?? {} as UserAddress} />
                  </Box>
                )
              }
              {showDeliverySections && (
                <Box>
                  <TipOptions />
                </Box>
              )}

              <Box>
                {customerDetails &&
                  Object.keys(customerDetails).length === 0 ? (
                  <AddAddressSection isMobile={isMobile} />
                ) : (
                  <>
                    {/* {showDeliverySections && customerDetails?.address &&
                      Object.keys(customerDetails.address).length === 0 && (
                        <AddressSection
                          userAddress={
                            customerDetails.address || ({} as UserAddress)
                          }
                        />
                      )} */}
                    <PaymentCheckout
                      scrollToBillDetails={scrollToBillDetails}
                    />
                  </>
                )}
              </Box>
            </Box>
          </Box>
          {!isMobile && (
            <Box
              sx={{
                flexShrink: 0,
                marginLeft: 'auto',
                position: 'relative',
                width: 350,
                height: '100vh',
                overflow: 'hidden',
                marginTop: '85px', // Adds space from the top
                display: 'flex',
                flexDirection: 'column', // Stacks slideshow & image vertically
                alignItems: 'center', // Centers the delivery image
              }}
            >
              {/* Slideshow */}
              <Box
                sx={{
                  width: '100%',
                  height: '100%', // Set a fixed height
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {images.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`Discount ${index + 1}`}
                    width={350}
                    height={350}
                    className="object-cover transition-opacity duration-1000"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      opacity: index === currentIndex ? 1 : 0, // Show only the active image
                      transition: 'opacity 1s ease-in-out',
                    }}
                  />
                ))}
              </Box>

              {/* Delivery Man Image (Placed below slideshow) */}
              <Image
                src="https://testing.indiantadka.eu/assets/deliveryMan.gif"
                alt="Delivery Man"
                width={300} // Increased size for visibility
                height={100}
                className="object-cover mt-4 ml-2" // Adds margin-top
              />
            </Box>
          )}
        </Box>
      </Box>



    );
  }
};

export default Checkout;
