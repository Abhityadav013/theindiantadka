import React from 'react';
import { Card, CardContent, CardHeader, Button } from "@mui/material";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { UserAddress } from '../utils/types/address_type';

interface AddressOptionsProps {
    userAddress: UserAddress[];
    onClose: () => void;
}

const AddressOptions: React.FC<AddressOptionsProps> = ({ userAddress, onClose }) => {
    return (
        <div className="w-full max-w-3xl mx-auto bg-white shadow-2xl border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Choose a delivery address</h2>
            </div>
            <p className="text-gray-600 mb-4">Multiple addresses in this location</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(userAddress) && userAddress.map((address) => (
                    <Card
                        key={address.town}
                        className="p-4 flex flex-col justify-between"
                        sx={{
                            minHeight: '300px',
                            border: '1px solid rgba(2, 6, 12, .1)',
                            boxShadow: 'none',
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
                        </CardContent>
                        <Button className="mt-3 bg-green-600 text-white hover:bg-green-700 w-full" onClick={onClose}>
                            DELIVER HERE
                        </Button>
                    </Card>
                ))}
                <Card
                    className="border p-4 flex flex-col justify-between"
                    sx={{
                        minHeight: '300px',
                        border: '2px dashed rgba(2, 6, 12, .1)',
                        boxShadow: 'none',
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
                    <Button className="mt-3 bg-green-600 text-white hover:bg-green-700 w-full" onClick={onClose}>
                        ADD NEW
                    </Button>
                </Card>
            </div>
        </div>
    );
}

export default AddressOptions;
