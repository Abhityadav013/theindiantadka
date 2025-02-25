
"use client"
import React, { useCallback, useEffect, useState } from "react";
import AddNewAddress, { AddressInput } from "./AddNewAddress";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { AppDispatch } from "../redux/store";
import { getLocationData } from "../utils/location_data";
import { UserAddress } from "../utils/types/address_type";
// import AddressOptions from "./AddressOptions";
import DeliveryAddress from "./DefaultAddress";
import AddressOptions from "./AddressOptions";
import CheckoutSteps from "./CheckoutSteps/CheckOutStep";

const AddressSelection = () => {
  const [isAddressFetched, setIsAddressFetched] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [isDeliveryAddressModal, setDeliveryAddressModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<UserAddress | undefined>();
  const { addressModel: isAddressModelOpen, address, userAddress } = useSelector((state: RootState) => state.address);
  const dispatch = useDispatch<AppDispatch>();
  const onSubmit = (values: AddressInput) => {
    const userAddress: UserAddress = {
      ...values,
      displayAddress: `${values.street} ${values.buildingNumber}, ${values.pincode} ${address?.village ?? ''} ${address?.town ?? ''},${address.country}`,
    }
    dispatch({ type: 'address/updateUserAddress', payload: userAddress })
  };

  const closeAddressDrawer = useCallback(() => {
    dispatch({ type: "address/closeAddressModel" });
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

  useEffect(() => {
    if (userAddress.length > 0) {
      const address = userAddress.find((add) => add.addressType === 'home') || null;
      setDeliveryAddress(address ?? undefined);
    }
  }, [userAddress]);


  return (
    <div className="p-6 bg-white">
    <AddNewAddress onSubmit={onSubmit} isOpen={isAddressModelOpen} onClose={closeAddressDrawer} address={address} />
    <CheckoutSteps />
    {
        (userAddress.length > 0 || userAddress.some((address) => address.addressType === 'home')) && !isDeliveryAddressModal && false
          ? <DeliveryAddress addressData={deliveryAddress} onClose={() => setDeliveryAddressModal(!isDeliveryAddressModal)} />
          : <AddressOptions userAddress={userAddress} onClose={() => setDeliveryAddressModal(!isDeliveryAddressModal)} />
    }
  </div>
  )

};

export default AddressSelection;
