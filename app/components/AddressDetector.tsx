"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { FoodItem } from "../utils/types/menu_type";
import { fetchCartTotal } from "../redux/reducers/cartReducer";

const AddressDetector: React.FC = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state: RootState) => state.cart);
  const foodItems: FoodItem[] = useSelector((state: RootState) => state.menu.foodMenuItems);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, cartItem) => {
      const foodItemMatch = foodItems.find(item => item.id === cartItem.itemId);
      return foodItemMatch ? total + foodItemMatch.price * cartItem.quantity : total;
    }, 0);
  }, [cart, foodItems]);

  useEffect(() => {
    if (cartTotal) {
      dispatch(fetchCartTotal(cartTotal))
    }
  }, [dispatch, cartTotal])
  useEffect(() => {
    dispatch({ type: "customerDetails/fetchCustomerDetailsSaga" });
  }, [dispatch]);

  return <></>;
};

export default AddressDetector;
