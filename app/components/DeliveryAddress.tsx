
"use client"
import React from "react";
import { Card, CardContent, CardHeader, Button } from "@mui/material";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import AddNewAddress from "./AddNewAddress";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { AppDispatch } from "../redux/store";

interface Address {
  id: number,
  type: string,
  label: string,
  address: string,
  eta: string
}
const dummyAddresses: Address[] = [
  {
    id: 1,
    type: "home",
    label: "Home",
    address: "117/22, Shiv Nagar, Shakti Park Colony, Sector 10A, Gurugram, Haryana 122001, India",
    eta: "39 MINS",
  },
  {
    id: 2,
    type: "office",
    label: "Work",
    address: "217, Fatehpur, Haryana 122018, India",
    eta: "42 MINS",
  }
]

const AddressSelection = () => {
  const isAddressModelOpen = useSelector((state: RootState) => state.address.addressModel);
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = () => {
    // handle login form submit
  };
  const opemAddressDrawer = () =>{
    dispatch({ type: "address/openAddressModel" });
  }
  const closeAddressDrawer = () =>{
    dispatch({ type: "address/closeAddressModel" });
  }

  return (
    <div className="p-6 bg-gray-100">
      <AddNewAddress onSubmit={onSubmit} isOpen={isAddressModelOpen} onClose={closeAddressDrawer} />
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold">Choose a delivery address</h2>
        <p className="text-gray-600 mb-4">Multiple addresses in this location</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dummyAddresses.map((address) => (
            <Card
              key={address.id}
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
                    {address.type === "home" ? "🏠" : "🏢"}
                    <span className="font-semibold">{address.label}</span>
                  </div>
                }
              />
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600">{address.address}</p>
                <p className="text-sm font-semibold mt-2">{address.eta}</p>
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
