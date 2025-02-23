"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import LoginForm, { LoginInput } from "./LoginForm";
import { Box, CircularProgress } from "@mui/material";
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

const NavBar = () => {
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);
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
      setUserDetails(response.data.data.userDetails);
      dispatch(fetchUserSuccess(response.data.data.userDetails))
    } catch (err) {
      console.error("Error fetching user:", err);
      setUserDetails(null);
    }
    finally {
      setLoading(false); // Set loading to false after fetching completes
    }
  }, [dispatch]);

  useEffect(() => {
    if (!userDetails) {
      fetchUser();
    }
  }, [fetchUser, userDetails])

  useEffect(() => {
    dispatch({ type: "user/fetchUserLocation" });
    dispatch({ type: "menu/fetchMenuSaga" });
    dispatch({ type: "cart/fetchCartSaga" });
    dispatch({ type: "cart/fetchCartDescriptionSaga" })
    dispatch({ type: "address/fetchUserAddressSaga" })
  }, [dispatch]);

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
      console.error("Login failed:", err);
    }
  };

  const onSignIn = () => {
    // handle login form submit
  };

  const logoutUser = async () => {
    try {
      const response = await api.post(`${base_url}/logout`, {
        withCredentials: true,
      });
      if (response.data.statusCode === 200) {
        setUserDetails(null);
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };
  const onGoogleLogin = () => {
    // handle google login
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

      {isLoading ? (
        <CircularProgress size={30} /> // Show spinner while loading
      ) : !userDetails ? (
        <AccountCircleIcon
          onClick={() => setIsLogin(true)}
          sx={{ fontSize: "30px", borderRadius: "50%", background: "tomato", fill: "azure" }}
        />
      ) : (
        <UserProfileMenu userData={userDetails} logoutUser={logoutUser} sendOTP={sendOTP} />
      )}
      {
        isLogin && <LoginForm onLogin={onLogin} onSignIn={onSignIn} onGoogleLogin={onGoogleLogin} isOpen={isLogin} onClose={() => setIsLogin(!isLogin)} />
      }

      {
        <OTPComponent isOpen={otpModal} onClose={otpModalClose} otpExpiresAt={otpExpireAt} verifyOTP={verifyOTP} resendOTP={resendOTP} />
      }
    </Box>
  );
};

export default NavBar;
