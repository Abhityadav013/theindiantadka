"use client";
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import LoginForm, { LoginInput, SignInInput } from './LoginForm';
import { ErrorResponse } from './Navbar';
import { UserProfile } from '../utils/types/user_details';
import { base_url } from '../utils/api_url';
import api from '../utils/axiosInstance';
import axios from 'axios';
import { fetchUserSuccess, setLoginModal } from '../redux/reducers/userProfileReducer';
import { AppDispatch } from '../redux/store';
import { Cart } from '../utils/types/cart_type';

const LoginDrawer = () => {
  const [userDetails, setUserDetails] = React.useState<UserProfile | null>(null);
  const [isLoading, setLoading] = React.useState(true);
  const [formError, setFormError] = React.useState<ErrorResponse[]>([]);
  const cart: Cart[] = useSelector((state: RootState) => state.cart.cart);
  const { loginModal } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get(`${base_url}/profile`, {
        withCredentials: true,
      });
      if (response.data.statusCode === 200) {
        setUserDetails(response.data.data.userDetails);
        dispatch(fetchUserSuccess(response.data.data.userDetails));
      }
    } finally {
      setLoading(false); // Set loading to false after fetching completes
    }
  }, [dispatch]);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("_is_user_logged_in");
    if (!userDetails && isUserLoggedIn) {
      fetchUser();
      dispatch({ type: "address/fetchUserAddressSaga" });
    } else {
      setLoading(false);
    }
  }, [fetchUser, dispatch, userDetails]);

  useEffect(() => {
    dispatch({ type: "user/fetchUserLocation" });
    dispatch({ type: "menu/fetchMenuSaga" });
    dispatch({ type: "cart/fetchCartSaga" });
  }, [dispatch]);

  useEffect(() => {
    if (cart.length > 0) {
      dispatch({ type: "cart/fetchCartDescriptionSaga" });
    }
  }, [dispatch, cart]);

  const onLogin = async (values: LoginInput) => {
    try {
      const response = await api.post(
        `${base_url}/login`,
        { email: values.email, password: values.password },
        { withCredentials: true }
      );
      if (response.data.statusCode === 200) {
        localStorage.setItem("_is_user_logged_in", 'true');
        fetchUser(); // Fetch user after successful login
        dispatch(setLoginModal(false));
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data?.data);
      }
    }
  };

  const onSignIn = async (values: SignInInput) => {
    try {
      const response = await api.post(
        `${base_url}/register`,
        { ...values },
        { withCredentials: true }
      );
      if (response.data.statusCode === 201) {
        localStorage.setItem("_is_user_logged_in", 'true');
        fetchUser(); // Fetch user after successful login
        dispatch(setLoginModal(false));
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data?.data);
      }
    }
  };

  const onGoogleLogin = async (credential: string) => {
    try {
      const response = await api.post(`${base_url}/auth/google`, {
        credential,
      });

      if (response.data.statusCode === 201 || response.data.statusCode === 200) {
        localStorage.setItem("_is_user_logged_in", 'true');
        fetchUser(); // Fetch user after successful login
        dispatch(setLoginModal(false));
      }
    } catch (error) {
      console.error("Error occurred during Google login:", error);
    }
  };

  const onClose = () => {
    dispatch(setLoginModal(false));
  };

  if (isLoading) {
    return null;
  } else {
    return (
      loginModal && <LoginForm onLogin={onLogin} onSignIn={onSignIn} onGoogleLogin={onGoogleLogin} isOpen={loginModal} onClose={onClose} error={formError} setFormError={setFormError} />
    );
  }
};

export default LoginDrawer;
