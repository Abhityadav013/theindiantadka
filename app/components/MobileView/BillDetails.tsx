'useClient';
import React, { useMemo } from 'react'
import { Box, Typography, Divider } from "@mui/material";
import { FoodItem } from '@/app/utils/types/menu_type';
import { RootState } from '@/app/redux/reducers';
import { useSelector } from 'react-redux';
const BillDetails = () => {
    const { cart } = useSelector((state: RootState) => state.cart);
    const foodItems: FoodItem[] = useSelector((state: RootState) => state.menu.foodMenuItems);

    const gstAndRestaurantCharges = 10; // You can make this dynamic if needed
    const cartTotal = useMemo(() => {
        return cart.reduce((total, cartItem) => {
            const foodItemMatch = foodItems.find(item => item.id === cartItem.itemId);
            return foodItemMatch ? total + foodItemMatch.price * cartItem.quantity : total;
        }, 0);
    }, [cart, foodItems]);

    return (
        <Box className="mt-4 p-4 border rounded-lg bg-white shadow-md">
            <Typography variant="h6" className="font-semibold">Bill Details</Typography>
            <Box className="mt-2 text-gray-700 space-y-1">
                <Typography variant="body2" className="flex justify-between">Item Total <span>€{cartTotal}</span></Typography>
                <Typography variant="body2" className="flex justify-between">Delivery Fee | 5.0 kms <span>€2</span></Typography>
                <Typography variant="caption" className="text-gray-500">This fee fairly goes to our delivery partners for delivering your food</Typography>
                <Typography variant="body2" className="flex justify-between text-orange-500 cursor-pointer">Delivery Tip <span>Add tip</span></Typography>
                <Typography variant="body2" className="flex justify-between">Platform Fee <span>€10.00</span></Typography>
                <Typography variant="body2" className="flex justify-between">GST and Restaurant Charges <span>€{gstAndRestaurantCharges}</span></Typography>
                <Divider className="my-2" />
                <Typography variant="body1" className="flex justify-between font-semibold">To Pay <span>€{cartTotal}</span></Typography>
            </Box>
        </Box>
    )
}

export default BillDetails
