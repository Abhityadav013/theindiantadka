"use client"
import React, { useEffect } from "react";
import CartPayments from "../components/CartPayments";
import { LocationOn, Payment } from "@mui/icons-material";
import CartHistory from "../components/CartHistory";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import EmptyCart from "../components/EmptyCart";
import Loader from "../components/Loader";
import { useRouter } from "next/navigation";

const CartItem = () => {
  const router = useRouter();
  const { cart: cartItems } = useSelector((state: RootState) => state.cart);
    const isMobileView = useSelector((state: RootState) => state.mobile.isMobile);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (cartItems.length > 0) {
      setTimeout(() => {
        setIsLoading(false);
      }, 700); // 5000 ms = 5 seconds
    } else {
      // Simulate a 5-second delay before showing the data
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // 5000 ms = 5 seconds
    }
  }, [cartItems]);

  useEffect(() => {
    if (isMobileView) {
      router.push("/checkout"); // Redirect to the checkout page
    }
  }, [isMobileView, router]);
  
  return isLoading ? (
    <Loader loadingImage={'https://testing.indiantadka.eu/assets/cart-item-loader.gif'} isLoading={isLoading} />
  ) : (
    <>
      {
        cartItems.length > 0
          ? <div className="max-w-6xl mx-auto flex justify-between gap-4 bg-white">
              <div className="flex-1 relative">
                <div className="relative flex items-start">
                  <div className="absolute -left-0 top-2">
                    <LocationOn className="bg-black text-white rounded p-1" fontSize="large" />
                  </div>
                </div>
                <div className="absolute left-4 top-12 bottom-5 w-0.5 border-l-2 border-dotted border-gray-400"></div>

                {/* Cart Payments */}
                <div className="relative flex items-start mt-6">
                  <div className="absolute -left-0 top-3">
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
