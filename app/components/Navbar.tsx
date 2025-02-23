"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import LoginForm, { LoginInput, SignInInput } from "./LoginForm";
import { Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Profile icon import
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { Cart } from "../utils/types/cart_type";
import { base_url } from "../utils/api_url";
import api from "../utils/axiosInstance";
import { UserProfile } from "../utils/types/user_details";
import { fetchUserSuccess } from "../redux/reducers/userProfileReducer";
import UserProfileMenu from "./UserProfile";
import OTPComponent from "./OTPComponent";
import axios from "axios";

// Type for a single error message
interface FieldError {
  key: string;
  message: string;
}

// Type for the error response
export type ErrorResponse = FieldError[];


const NavBar = () => {
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);
  const [formError,setFormError] = useState<ErrorResponse>([])
  const [isLoading, setLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(false);
  const cart: Cart[] = useSelector((state: RootState) => state.cart.cart);
  const { otpModal, otpExpireAt } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get(`${base_url}/profile`, {
        withCredentials: true,
      });
      if (response.data.statusCode === 200) {
        setUserDetails(response.data.data.userDetails);
        dispatch(fetchUserSuccess(response.data.data.userDetails))
      }
    }
    finally {
      setLoading(false); // Set loading to false after fetching completes
    }
  }, [dispatch]);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("_is_user_logged_in");
    if (!userDetails && isUserLoggedIn) {
      fetchUser();
      dispatch({ type: "address/fetchUserAddressSaga" })
    } else {
      setLoading(false)
    }
  }, [fetchUser, dispatch, userDetails])

  useEffect(() => {
    dispatch({ type: "user/fetchUserLocation" });
    dispatch({ type: "menu/fetchMenuSaga" });
    dispatch({ type: "cart/fetchCartSaga" });
  }, [dispatch]);

  useEffect(() => {
    if (cart.length > 0) {
      dispatch({ type: "cart/fetchCartDescriptionSaga" })
    }

  }, [dispatch, cart])

  const onLogin = async (values: LoginInput) => {
    try {
      const response = await api.post(
        `${base_url}/login`,
        { email: values.email, password: values.password },
        { withCredentials: true }
      );
      if (response.data.statusCode === 200) {
        localStorage.setItem(
          "_is_user_logged_in",
          'true'
        );
        fetchUser(); // Fetch user after successful login
        setIsLogin(false);
      }
    } catch (err) {
      if(axios.isAxiosError(err)){
        setFormError( err.response?.data?.data)
      }
    }
  };

  const onSignIn = async(values:SignInInput) => {
    try {
      const response = await api.post(
        `${base_url}/register`,
        { ...values },
        { withCredentials: true }
      );
      if (response.data.statusCode === 201) {
        localStorage.setItem(
          "_is_user_logged_in",
          'true'
        );
        fetchUser(); // Fetch user after successful login
        setIsLogin(false);
      }
    } catch (err) {
      if(axios.isAxiosError(err)){
        setFormError( err.response?.data?.data)
      }
    }
    // handle login form submit
  };
  

  const logoutUser = async () => {
    try {
      const response = await api.post(`${base_url}/logout`, {
        withCredentials: true,
      });
      if (response.data.statusCode === 200) {
        setUserDetails(null);
        dispatch({ type: "cart/fetchCartSaga" });
        localStorage.removeItem("_is_user_logged_in");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const onGoogleLogin = async (credential: string) => {
    // handle google login
    try {
      // Send the Google login credential to your API endpoint to verify and register the user
      const response = await api.post(`${base_url}/auth/google`, {
        credential,
      });

      if (response.data.statusCode === 201 || response.data.statusCode === 200) {
        localStorage.setItem(
          "_is_user_logged_in",
          'true'
        );
        fetchUser(); // Fetch user after successful login
        setIsLogin(false);
      }
    } catch (error) {
      console.error("Error occurred during Google login:", error);
    }
  };

  const sendOTP = () => {
    dispatch({ type: "user/fetchProfileOTPSaga" });
  }
  const verifyOTP = () => {
    console.log('Step 1')

  }

  const resendOTP = () => {

  }

  const otpModalClose = () => {
    dispatch({ type: "user/closeOTPModel" });
  }

  return (
    !isLoading && (
      <Box className="flex items-center gap-10 md:gap-7 sm:gap-5">
        {/* Search Icon */}

        {/* Cart Icon and Cart Count */}
        <Box className="relative">
          <Link href="/cart">
            <Image
              src="https://testing.indiantadka.eu/assets/basket_icon.png"
              alt="Cart Icon"
              width={24}
              height={24}
              className="dark:invert sm:w-[20px]"
            />
          </Link>
          {

            cart.length > 0 && (
              <span className="absolute top-[-10px] right-[-8px] w-[18px] h-[18px] bg-red-500 border-2 border-white text-white text-xs font-bold flex items-center justify-center rounded-full shadow-md">
                {cart.length}</span>
            )
          }

        </Box>

        {/* Profile Circle with Account Icon */}
        {!userDetails ? (
          <AccountCircleIcon
            onClick={() => setIsLogin(true)}
            sx={{ fontSize: "30px", borderRadius: "50%", background: "tomato", fill: "azure" }}
          />
        ) : (
          <UserProfileMenu userData={userDetails} logoutUser={logoutUser} sendOTP={sendOTP} />
        )}
        {
          isLogin && <LoginForm onLogin={onLogin} onSignIn={onSignIn} onGoogleLogin={onGoogleLogin} isOpen={isLogin} onClose={() => setIsLogin(!isLogin)} error={formError} />
        }

        {
          <OTPComponent isOpen={otpModal} onClose={otpModalClose} otpExpiresAt={otpExpireAt} verifyOTP={verifyOTP} resendOTP={resendOTP} />
        }
      </Box>
    )

  );
};

export default NavBar;
