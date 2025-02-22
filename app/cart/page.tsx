"use client"
import React, { useEffect } from "react";
import CartPayments from "../components/CartPayments";
import DeliveryAddress from "../components/DeliveryAddress";
import { LocationOn, Payment } from "@mui/icons-material";
import CartHistory from "../components/CartHistory";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import EmptyCart from "../components/EmptyCart";
import Loader from "../components/Loader";

const CartItem = () => {
  const { cart: cartItems } = useSelector((state: RootState) => state.cart);
  const [isLoading, setIsLoading] = React.useState(true);
  // const [isAddressModelOpen, setAddressModelOpen] = React.useState(false);

  useEffect(() => {
    debugger
    if (cartItems.length > 0) {
      setIsLoading(false); // If no items, hide loader
    } else {
      // Simulate a 5-second delay before showing the data
      setTimeout(() => {
        setIsLoading(false);
      }, 5000); // 5000 ms = 5 seconds
    }
  }, [cartItems]);

    // const onSubmit = () => {
    //   // handle login form submit
    // };
  
  return isLoading ? (
    <Loader loadingImage={'https://testing.indiantadka.eu/assets/cart-item-loader.gif'} isLoading={isLoading} />
  ) : (
    <>
      {
        cartItems.length
          ? <div className="max-w-6xl mx-auto flex justify-between gap-4">
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

              <div className="w-1/3 mt-6">
                <CartHistory />
              </div>
            </div>
          : <div className="flex justify-center mt-10">
              <EmptyCart />
            </div>
      }
    </>
  );
};

export default CartItem;
