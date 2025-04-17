import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { UserAddress } from '@/app/utils/types/address_type';
import Person4Icon from '@mui/icons-material/Person4';
interface CustomerContactDetailsProps {
    customerName: string;
    customerPhone: string;
    customerAddress?: UserAddress;
    isDeliveryOrder?: boolean; // optional delivery order flag
    onEdit?: () => void; // optional edit callback
}

const CustomerContactDetails: React.FC<CustomerContactDetailsProps> = ({
    customerName,
    customerPhone,
    customerAddress,
    isDeliveryOrder = false, // default to false if not provided
    onEdit,
}) => {

    const formatPhoneNumber = (phone: string) => {
        const match = phone.match(/^(\d{2})(\d+)$/); // splits first 2 digits as country code
        if (!match) return phone;
        return `+${match[1]} ${match[2]}`;
    };
    return (
        <Box className="mt-4 p-4 border rounded-lg bg-white shadow-md">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" className="font-semibold">
                    <IconButton>
                        <Person4Icon fontSize="medium" className="text-gray-700" />
                    </IconButton>
                    Customer Details
                </Typography>
                <IconButton size="small" onClick={onEdit}>
                    <EditIcon fontSize="small" />
                </IconButton>
            </Box>

            <Box className="mt-2 text-gray-700 space-y-1">
                <Typography variant="body2" className="flex justify-between">
                    Name <span className="text-black-600 font-bold">{customerName}</span>
                </Typography>
                <Typography variant="body2" className="flex justify-between">
                    PhoneNumber <span>{formatPhoneNumber(customerPhone)}</span>
                </Typography>
                {
                    isDeliveryOrder && (
                        <div className="flex items-start gap-4">
                            {/* Icon block */}
                            <div className="relative w-12 h-12 mt-1 flex justify-center items-center border border-gray-300 rounded-lg">
                                <HomeIcon className="text-gray-700" fontSize="medium" />
                                <CheckCircleIcon className="absolute -top-2 -left-2 text-green-500 bg-white rounded-full" fontSize="small" />
                            </div>

                            {/* Address block */}
                            <div className="flex flex-col mt-2">
                                <Typography variant="body2" className="text-gray-900">
                                    {`${customerAddress?.street} ${customerAddress?.buildingNumber},${customerAddress?.town}`}
                                </Typography>
                                <Typography variant="body2" className="text-gray-600">
                                    {`${customerAddress?.pincode} Germany`}
                                </Typography>
                            </div>
                        </div>
                    )
                }


            </Box>
        </Box>
    );
};

export default CustomerContactDetails;
