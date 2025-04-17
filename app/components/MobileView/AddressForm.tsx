'use client'
import React, { useCallback, useEffect, useState } from 'react'
import AddNewAddress, { AddressInput, UserInfo } from '../AddNewAddress'
import { UserAddress } from '@/app/utils/types/address_type';
import { AppDispatch } from '@/app/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/reducers';
import { getLocationData } from '@/app/utils/location_data';
import { ErrorResponse } from '../Navbar';
import axios from 'axios';
import { CustomerDetails, CustomerOrder } from '@/app/utils/types/customer_details_type';
import { OrderType } from '@/app/models/Order';
import { closeCustomerDetailsModel } from '@/app/redux/reducers/customerDetailsReducer';


const AddressForm = () => {
  const [isAddressFetched, setIsAddressFetched] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = React.useState<ErrorResponse>([]);
  const isMobile = useSelector((state: RootState) => state.mobile.isMobile);
  const { address, userAddress } = useSelector((state: RootState) => state.address);
  const {customerDetailsFormError, customerDetailsModel: isAddressModelOpen, customerOrder } = useSelector((state: RootState) => state.customerDetails);
  const dispatch = useDispatch<AppDispatch>();
  const onSubmit = (values: { userInfo: UserInfo, orderType: OrderType, address?: AddressInput }) => {
    let userAddress: UserAddress = {
      displayAddress: '',
      buildingNumber: '',
      street: '',
      town: '',
      pincode: '',
      addressType: ''
    };
    const customerDetails: CustomerDetails = {
      name: values.userInfo.name,
      phoneNumber: values.userInfo.phoneNumber,
      address: userAddress,
      
    }
    if (values.address) {
      userAddress = {
        displayAddress: `${values.address?.street} ${values.address?.buildingNumber}, ${values.address?.pincode} ${values.address.town ?? ''}, Germany`,
        buildingNumber: values.address?.buildingNumber ?? '',
        street: values.address?.street ?? '',
        town: values.address?.town ?? '',
        pincode: values.address?.pincode ?? '',
        addressType: values.address?.addressType ?? ''
      }
      customerDetails.address = userAddress;
    }
    const payload: CustomerOrder = {
      customerDetails: customerDetails,
      orderType: values.orderType
    }
    dispatch({ type: 'customerDetails/updateCustomerDetailsSuccess', payload });
  };


  useEffect(() => {
    const fetchLocationInsights = async () => {
      if (customerDetailsFormError.length > 0) {
        setFormError(customerDetailsFormError);
      }
      if (customerDetailsFormError.length === 0) {
        dispatch(closeCustomerDetailsModel());
      }
    };

    fetchLocationInsights();
  }, [dispatch, customerDetailsFormError]);

  const closeAddressDrawer = useCallback(() => {
    dispatch(closeCustomerDetailsModel());
  }, [dispatch])


  useEffect(() => {
    const fetchLocationData = async () => {
      const storedLocation = localStorage.getItem("indian_tadka_userLocation");
      if (storedLocation) {
        try {
          const parsedLocation = JSON.parse(storedLocation);
          // Check if address is empty and location data hasn't been fetched yet
          if (address && Object.keys(address).length === 0 && !isAddressFetched) {
            setIsAddressFetched(true); // Set flag to prevent further API calls

            // Call the API to get the address
            const userAddress = await getLocationData(parsedLocation);

            // Dispatch address data and set loading to false
            dispatch({ type: "address/fetchAddressSuccess", payload: userAddress });
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Invalid location data in localStorage", error);
          if (axios.isAxiosError(error)) {
            setFormError(error.response?.data?.data);
          }
        }
      }
    };

    // Run the function to fetch location data only once
    if (address && Object.keys(address).length === 0 && isLoading) {
      fetchLocationData();
    }

    // Close the address drawer when userAddress is available
    if (userAddress && Object.keys(userAddress).length > 0) {
      closeAddressDrawer();
    }

  }, [dispatch, closeAddressDrawer, isLoading, address, userAddress, isAddressFetched]);
  return (
    <div>
      <AddNewAddress formValues={customerOrder ?? {} as CustomerOrder} onSubmit={onSubmit} isOpen={isAddressModelOpen} onClose={closeAddressDrawer} address={address} isMobile={isMobile} error={formError} setFormError={setFormError} />
    </div>
  )
}

export default AddressForm
