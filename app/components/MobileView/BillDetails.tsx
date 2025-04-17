'useClient';
import React, { useEffect, useState } from 'react'
import { Box, Typography, Divider, IconButton } from "@mui/material";
import { RootState } from '@/app/redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { openAddressModel } from '@/app/redux/reducers/addressReducer';
import { OrderType } from '@/app/models/Order';
import ReceiptIcon from '@mui/icons-material/Receipt';

interface BillDetailsSectionProps {
    isDeliveryOrder: boolean; // Image URL passed as a prop
    deliveryFee: string | null;
    isFreeDelivery: boolean
}

const BillDetails: React.FC<BillDetailsSectionProps> = ({ isDeliveryOrder, deliveryFee, isFreeDelivery }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [deliveryTip, setDeliveryTip] = useState<number | null>(null);
    const { cartTotal } = useSelector((state: RootState) => state.cart);
    const { isCustomerDetailsPresent } = useSelector(
        (state: RootState) => state.customerDetails,
    );

    const handleDeliveryAddress = () => {
        dispatch(openAddressModel())
    }
    useEffect(() => {
        const checkSessionStorage = () => {
            const tip = sessionStorage.getItem('tipAmount');
            if (tip && tip !== String(deliveryTip)) {
                setDeliveryTip(parseFloat(tip)); // Update the state with the new tip value
            }
            else if (!tip) {
                setDeliveryTip(null);
            }
        };

        // Initial load of the tip from sessionStorage
        checkSessionStorage();

        // Set up interval to check sessionStorage every 500ms
        const intervalId = setInterval(checkSessionStorage, 5);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [deliveryTip]);

    const addTipToDelivery = () => {
        sessionStorage.setItem('tipAmount', String(3));
    }
    const totalAmount = (cartTotal + Number(deliveryFee) + (deliveryTip ? Number(deliveryTip) : 0)).toFixed(2);
    useEffect(() => {
        sessionStorage.setItem('cartTotalAmount', totalAmount);
    }, [cartTotal, deliveryFee, deliveryTip, totalAmount])


    return (
        <Box className="mt-4 p-4 border rounded-lg bg-white shadow-md">
            <Typography variant="h6" className="font-semibold">
                <IconButton>
                    <ReceiptIcon fontSize="medium" className="text-gray-700" />
                </IconButton>

                Bill Details</Typography>
            <Box className="mt-2 text-gray-700 space-y-1">
                <Typography variant="body2" className="flex justify-between">Order Type<span className='text-orange-600 font-bold'>{isDeliveryOrder ? OrderType.DELIVERY : OrderType.PICKUP}</span></Typography>
                <Typography variant="body2" className="flex justify-between">Item Total <span>€{cartTotal}</span></Typography>
                {isDeliveryOrder && (
                    <>
                        <Typography variant="body2" className="flex justify-between">Delivery Fee<span className={!deliveryFee ? `text-emerald-600 text-xs cursor-pointer` : ''} onClick={handleDeliveryAddress}>{!isCustomerDetailsPresent ? 'Add Delivery Address' : `€${deliveryFee}`}</span></Typography>
                        <Typography variant="caption" className="text-gray-500">This fee fairly goes to our delivery partners for delivering your food</Typography>
                        <Typography variant="body2" className={`flex justify-between ${deliveryTip ? '' : 'text-orange-500 cursor-pointer'} `}>Delivery Tip {deliveryTip ? <span>€{deliveryTip}</span> : (isFreeDelivery ? <span>Free</span> : <span onClick={addTipToDelivery}>Add tip</span>)}</Typography>
                    </>)}{/* <Typography variant="body2" className="flex justify-between">GST and Restaurant Charges <span>€{gstAndRestaurantCharges}</span></Typography> */}
                <Divider className="my-2" />
                <Typography variant="body1" className="flex justify-between font-semibold">
                    To Pay
                    <span>
                        €{(cartTotal + Number(deliveryFee) + (deliveryTip ? Number(deliveryTip) : 0)).toFixed(2)}
                    </span>
                </Typography>
            </Box>
        </Box>
    )
}

export default BillDetails
