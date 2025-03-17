'useClient';
import React, { useEffect, useState } from 'react'
import { Box, Typography, Divider } from "@mui/material";
import { RootState } from '@/app/redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { openAddressModel } from '@/app/redux/reducers/addressReducer';
import { getDistanceFromLatLon, Location } from '@/app/libs/common/distanceUserLocation';


const BillDetails = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [deliveryTip, setDeliveryTip] = useState<string | null>(null);
    const [deliveryFee, setDeliveryFee] = useState<string | null>(null);
    const { cartTotal } = useSelector((state: RootState) => state.cart);
    const { userAddress } = useSelector((state: RootState) => state.address);

    const handleDeliveryAddress = () => {
        dispatch(openAddressModel())
    }
    useEffect(() => {
        const storedLocation = localStorage.getItem('indian_tadka_userLocation');
        const INDIAN_TADKA_LAT = process.env.NEXT_PUBLIC_INDIAN_TADKA_LAT;
        const INDIAN_TADKA_LNG = process.env.NEXT_PUBLIC_INDIAN_TADKA_LNG;

        if (storedLocation && userAddress.length > 0) {
            try {
                const locationData = JSON.parse(storedLocation);

                const restroLocation: Location = {
                    lat: Number(INDIAN_TADKA_LAT),
                    lon: Number(INDIAN_TADKA_LNG)
                };

                const parsedUserLocation: Location = {
                    lat: locationData.lat,
                    lon: locationData.lng
                };

                // Get distance and handle it (store, log, or use it)
                const distance = getDistanceFromLatLon(restroLocation, parsedUserLocation);
                if (typeof distance !== 'boolean') {
                    setDeliveryFee(distance)
                }
            } catch (error) {
                console.error("Error parsing user location:", error);
            }
        }
    }, [userAddress]);

    useEffect(() => {
        const checkSessionStorage = () => {
            const tip = sessionStorage.getItem('tipAmount');
            if (tip && tip !== deliveryTip) {
                setDeliveryTip(tip); // Update the state with the new tip value
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
        sessionStorage.setItem('tipAmount', String(10));
    }
    const totalAmount = (cartTotal + Number(deliveryFee) + (deliveryTip ? Number(deliveryTip) : 0)).toFixed(2);
    useEffect(() => {
        sessionStorage.setItem('cartTotalAmount', totalAmount);
    }, [cartTotal, deliveryFee, deliveryTip, totalAmount])

    return (
        <Box className="mt-4 p-4 border rounded-lg bg-white shadow-md">
            <Typography variant="h6" className="font-semibold">Bill Details</Typography>
            <Box className="mt-2 text-gray-700 space-y-1">
                <Typography variant="body2" className="flex justify-between">Item Total <span>€{cartTotal}</span></Typography>
                <Typography variant="body2" className="flex justify-between">Delivery Fee<span className={!deliveryFee ? `text-emerald-600 text-xs cursor-pointer` : ''} onClick={handleDeliveryAddress}>{userAddress?.length === 0 ? 'Add Delivery Address' : deliveryFee}</span></Typography>
                <Typography variant="caption" className="text-gray-500">This fee fairly goes to our delivery partners for delivering your food</Typography>
                <Typography variant="body2" className={`flex justify-between ${deliveryTip ? '' : 'text-orange-500 cursor-pointer'} `}>Delivery Tip {deliveryTip ? <span>€{deliveryTip}</span> : <span onClick={addTipToDelivery}>Add tip</span>}</Typography>
                {/* <Typography variant="body2" className="flex justify-between">GST and Restaurant Charges <span>€{gstAndRestaurantCharges}</span></Typography> */}
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
