"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Profile icon import
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { Cart } from "../utils/types/cart_type";
import { base_url } from "../utils/api_url";
import api from "../utils/axiosInstance";
import { UserProfile } from "../utils/types/user_details";
import { setLoginModal } from "../redux/reducers/userProfileReducer";
import UserProfileMenu from "./UserProfile";
import OTPComponent from "./OTPComponent";

// Type for a single error message
interface FieldError {
  key: string;
  message: string;
}

// Type for the error response
export type ErrorResponse = FieldError[];

const NavBar = () => {
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);
  const [isLoading, setLoading] = useState(true);
  const cart: Cart[] = useSelector((state: RootState) => state.cart.cart);
  const { otpModal, otpExpireAt, profile } = useSelector((state: RootState) => state.user);
  // const isMobileView = useSelector((state: RootState) => state.mobile.isMobile);
  const dispatch = useDispatch();

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("_is_user_logged_in");

    if (profile && isUserLoggedIn && Object.keys(profile).length > 0) {
      setLoading(false);
      setUserDetails(profile);
    } else {
      setLoading(false);
    }
  }, [profile]);

  const logoutUser = async () => {
    try {
      const response = await api.post(`${base_url}/logout`, {
        withCredentials: true,
      });
      if (response.data.statusCode === 200) {
        setUserDetails(null);
        dispatch({ type: "cart/fetchCartSaga" });
        localStorage.removeItem("_is_user_logged_in");
        localStorage.setItem('tid', response.data.tid);
        localStorage.setItem('ssid',response.data.deviceId)
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const sendOTP = () => {
    dispatch({ type: "user/fetchProfileOTPSaga" });
  };
  const verifyOTP = () => { };

  const resendOTP = () => { };

  const otpModalClose = () => {
    dispatch({ type: "user/closeOTPModel" });
  };

  return (
    !isLoading && (
      <Box className="flex items-center gap-10 md:gap-7 sm:gap-5">
        {/* Search Icon */}

        {/* Cart Icon and Cart Count */}
        <Box className="relative">
          {/* ToDo:: Allow this when we have Login Functioanlity */}
          {/* <Link href={isMobileView ? "/checkout" : "/cart"}> */}
          <Link href={'/order-details'}>
            <Image
              src="https://d17b2befa637skvb.public.blob.vercel-storage.com/basket_icon.png"
              alt="Cart Icon"
              width={24}
              height={24}
              className="dark:invert sm:w-[20px]"
            />
          </Link>
          {cart.length > 0 && (
            <span className="absolute top-[-10px] right-[-8px] w-[18px] h-[18px] bg-red-500 border-2 border-white text-white text-xs font-bold flex items-center justify-center rounded-full shadow-md">
              {cart.length}
            </span>
          )}
        </Box>

        {/* Profile Circle with Account Icon */}
        { userDetails === null || userDetails?.name === '' ? (
          <AccountCircleIcon
            onClick={() => dispatch(setLoginModal(true))}
            sx={{ fontSize: "30px", borderRadius: "50%", background: "tomato", fill: "azure" }}
          />
        ) : (
          <UserProfileMenu userData={userDetails} logoutUser={logoutUser} sendOTP={sendOTP} />
        )}

        {
          <OTPComponent isOpen={otpModal} onClose={otpModalClose} otpExpiresAt={otpExpireAt} verifyOTP={verifyOTP} resendOTP={resendOTP} />
        }
      </Box>
    )
  );
};

export default NavBar;
