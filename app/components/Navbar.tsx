"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import LoginForm, { LoginInput } from "./LoginForm";
import { Box, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Profile icon import
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { Cart } from "../utils/types/cart_type";
import { base_url } from "../utils/api_url";
import api from "../utils/axiosInstance";
import { UserProfile } from "../utils/types/user_details";
import { fetchUserSuccess } from "../redux/reducers/userProfileReducer";
import UserProfileMenu from "./UserProfile";

const NavBar = () => {
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const cart: Cart[] = useSelector((state: RootState) => state.cart.cart);
  const dispatch = useDispatch()

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
  }, [dispatch]);

  const onLogin = async (values: LoginInput) => {
    try {
      const response = await api.post(
        `${base_url}/login`,
        { email: values.email, password: values.password },
        { withCredentials: true }
      );
      if (response.data.statusCode === 200) {
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
        // setCartItems({});
        // setCartItemCount(0);
        // handleCart();
        // handleRedirectPage("/");
        // navigate("/");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };
  const onGoogleLogin = () => {
    // handle google login
  };
  useEffect(() => {
    if (!userDetails) {
      fetchUser();
    }
  }, [fetchUser, userDetails])

  useEffect(() => {
    dispatch({ type: "user/fetchUserLocation" });
    dispatch({ type: "menu/fetchMenuSaga" });
    dispatch({ type: "cart/fetchCartSaga" });
    dispatch({ type: "address/fetchUserAddressSaga" })
  }, [dispatch]);
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
      <IconButton component="span">
        {
          !userDetails
            ? <AccountCircleIcon onClick={() => setIsLogin(true)} sx={{ fontSize: "30px", borderRadius: '50%', background: "tomato", fill: "azure" }} />
            : <UserProfileMenu userData={userDetails} logoutUser={logoutUser} />
        }
      </IconButton>

      {
        isLogin && <LoginForm onLogin={onLogin} onSignIn={onSignIn} onGoogleLogin={onGoogleLogin} isOpen={isLogin} onClose={() => setIsLogin(!isLogin)} />
      }
    </Box>
  );
};

export default NavBar;
