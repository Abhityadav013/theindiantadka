"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import { Box, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Profile icon import
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { Cart } from "../utils/types/cart_type";

const NavBar = () => {
  const cart: Cart[] = useSelector((state: RootState) => state.cart.cart);
  const dispatch = useDispatch()

  const onSubmit = () => {
    // handle login form submit
  };

  const onGoogleLogin = () => {
    // handle google login
  };

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    dispatch({ type: "user/fetchUserLocation" });
    dispatch({ type: "menu/fetchMenuSaga" });
    dispatch({ type: "cart/fetchCartSaga" });

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
      <IconButton>
        <AccountCircleIcon onClick={() => setIsLogin(true)} sx={{ fontSize: "30px", borderRadius: '50%', background: "tomato", fill: "azure" }} /> {/* Profile icon */}
      </IconButton>

      {
        isLogin && <LoginForm onSubmit={onSubmit} onGoogleLogin={onGoogleLogin} isOpen={isLogin} onClose={() => setIsLogin(!isLogin)} />
      }
    </Box>
  );
};

export default NavBar;
