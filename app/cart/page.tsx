import React from "react";
import CartPayments from "../components/CartPayments";
import DeliveryAddress from "../components/DeliveryAddress";
import { LocationOn, Payment } from "@mui/icons-material";
import CartHistory from "../components/CartHistory";

const CartItem = () => {
  return (
    <div className="max-w-6xl mx-auto flex justify-between gap-4">
      {/* Left Section (Main Content) */}
      <div className="flex-1 relative">
        <div className="relative flex items-start">
          <div className="absolute -left-8 top-3">
            <LocationOn className="bg-black text-white rounded p-1" fontSize="large" />
          </div>
          <DeliveryAddress />
        </div>
        <div className="absolute -left-3.5 top-12 bottom-5 w-0.5 border-l-2 border-dotted border-gray-400"></div>

        {/* Cart Payments */}
        <div className="relative flex items-start mt-6">
          <div className="absolute -left-8 top-3">
            <Payment className="bg-black text-white rounded p-1" fontSize="large" />
          </div>
          <CartPayments />
        </div>
      </div>

      {/* Right Section (Cart History) */}
      <div className="w-1/3 mt-6">
        <CartHistory />
      </div>
    </div>
  );
};

export default CartItem;
