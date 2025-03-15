import { Card, CardContent } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React from 'react'
import { UserAddress } from "@/app/utils/types/address_type";


interface AddressSectionProps {
  userAddress: UserAddress[]; // Image URL passed as a prop
}
const AddressSection: React.FC<AddressSectionProps> = ({userAddress}) => {
  return (
    <Card className="flex items-center mt-4 p-3 border border-gray-300 shadow-sm rounded-lg w-full">
      {/* Icon Section */}
      <div className="relative w-12 h-12 flex justify-center items-center border border-gray-300 rounded-lg">
        <HomeIcon className="text-gray-700" fontSize="medium" />
        <CheckCircleIcon className="absolute -top-2 -left-2 text-green-500 bg-white rounded-full" fontSize="small" />
      </div>

      {/* Delivery Info */}
      <CardContent className="flex-1 ml-4 p-0">
        <h3 className="text-lg font-semibold">Deliver to Home</h3>
        <p className="text-sm text-gray-500">{userAddress[0]?.street||''}</p>
        <p className="text-sm font-bold">35-40 MINS</p>
      </CardContent>

      {/* Change Option */}
      <button className="text-orange-500 font-semibold text-sm">CHANGE</button>
    </Card>
  )
}

export default AddressSection