
"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Button } from "@mui/material";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { AppDispatch } from "../redux/store";
import { getLocationData } from "../utils/location_data";
import { UserAddress } from "../utils/types/address_type";
import AddNewAddress, { AddressInput } from "../components/AddNewAddress";

const AddressSelection = () => {
  const [isAddressFetched, setIsAddressFetched] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const { addressModel: isAddressModelOpen, address, userAddress } = useSelector((state: RootState) => state.address);
  const dispatch = useDispatch<AppDispatch>();
  const onSubmit = (values: AddressInput) => {
    const userAddress: UserAddress = {
      ...values,
      displayAddress: `${values.street} ${values.buildingNumber}, ${values.pincode} ${address?.village} ${address?.town},${address.country}`,
    }
    dispatch({type:'address/updateUserAddress',payload:userAddress})
  };
  const opemAddressDrawer = () => {
    dispatch({ type: "address/openAddressModel" });
  }
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
          if (!address && Object.keys(address).length === 0 && !isAddressFetched) {
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
    if (!address && Object.keys(address).length === 0 && isLoading) {
      fetchLocationData();
    }

    // Close the address drawer when userAddress is available
    if (userAddress && Object.keys(userAddress).length > 0) {
      closeAddressDrawer();
    }

  }, [dispatch, closeAddressDrawer, isLoading, address, userAddress, isAddressFetched]);




  return (
    <div className="p-6 bg-gray-100">
      <AddNewAddress onSubmit={onSubmit} isOpen={isAddressModelOpen} onClose={closeAddressDrawer} address={address} />
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold">Choose a delivery address</h2>
        <p className="text-gray-600 mb-4">Multiple addresses in this location</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.isArray(userAddress) && userAddress.map((address) => (
            <Card
              key={address.flatNumber}
              className=" p-4 flex flex-col justify-between"
              sx={{
                minHeight: '300px',
                border: '1px solid rgba(2, 6, 12, .1)', // Solid border for delivery address
                boxShadow: 'none', // Remove box shadow
              }}
            >
              <CardHeader
                title={
                  <div className="flex items-center space-x-2">
                    {address.addressType === "home" ? "🏠" : "🏢"}
                    <span className="font-semibold">{address?.addressType}</span>
                  </div>
                }
              />
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600">{address?.displayAddress}</p>
                {/* <p className="text-sm font-semibold mt-2">{20}</p> */}
              </CardContent>
              <Button className="mt-3 bg-green-600 text-white hover:bg-green-700 w-full">
                DELIVER HERE
              </Button>
            </Card>
          ))}
          <Card
            className="border p-4 flex flex-col justify-between"
            sx={{
              minHeight: '300px',
              border: '2px dashed rgba(2, 6, 12, .1)', // Dashed border for Add New Address
              boxShadow: 'none', // Remove box shadow
            }}
          >
            <CardHeader
              title={
                <div className="flex items-center space-x-2">
                  <AddLocationIcon className="text-green-600" />
                  <span className="font-semibold">Add New Address</span>
                </div>
              }
            />
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-600">Add a new address to proceed with your order.</p>
            </CardContent>
            <Button className="mt-3 bg-green-600 text-white hover:bg-green-700 w-full"
              onClick={opemAddressDrawer}>
              ADD NEW
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressSelection;
