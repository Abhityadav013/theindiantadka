import React from "react";
import { Divider, CardContent, Typography, Box } from "@mui/material";
import Image from "next/image";
import { FoodItem } from "../utils/types/menu_type";
import { Cart } from "../utils/types/cart_type";


interface PaymentCheckoutCartProps {
    readonlyMode?: boolean;
    foodItem:FoodItem[];
    cart:Cart[];
}

const PaymentCheckoutCart: React.FC<PaymentCheckoutCartProps> = ({foodItem,cart}) => {
    return (
        <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <Image
            src="https://testing.indiantadka.eu/assets/food.webp"
            alt="Food"
            width={50}
            height={50}
            className="rounded"
          />
          <Typography variant="h6" className="font-bold text-gray-800">
            Your Order
          </Typography>
        </div>
      
        <Divider className="my-2" />
      
        {/* Table Header */}
        <div className="flex justify-between mb-2 text-sm font-semibold text-gray-600">
          <div className="w-[55%]">Item Name</div>
          <div className="w-[27%]">Qty</div>
          <div className="w-[20%] text-right">Price</div>
        </div>
      
        {/* Scrollable Items List */}
        <Box className="max-h-[20vh] overflow-y-auto scrollbar-hide">
          {foodItem.map((item, index) => {
            const cartItem = cart.find(cartItem => cartItem.itemId === item.id);
            const quantity = cartItem?.quantity || 0;
            const itemTotal = item.price * quantity;
      
            return (
              <div
                key={index}
                className="flex justify-between gap-4 my-4 items-center"
              >
                <div className="w-[55%]">
                  <Typography variant="body2" className="text-gray-700 text-sm">
                    {item.itemName}
                  </Typography>
                </div>
                <div className="w-[25%] flex items-center gap-2 justify-between">
                  <Typography
                    variant="body2"
                    className="font-semibold text-green-600 text-sm"
                  >
                    {quantity}
                  </Typography>
                </div>
                <div className="w-[20%] flex justify-end items-center">
                  <Typography
                    variant="body2"
                    className="font-semibold text-gray-800 text-sm"
                  >
                    €{itemTotal.toFixed(2)}
                  </Typography>
                </div>
              </div>
            );
          })}
        </Box>
      </CardContent>
      
    );
};

export default PaymentCheckoutCart;
