"use client"; // This runs only on the client side

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { FoodItem } from "../utils/types/menu_type";
import { IconButton, Box, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { AppDispatch } from "../redux/store";
import { updateCartItem } from "../redux/reducers/cartReducer";

export interface AddToCartButtonsProps {
  food_item: FoodItem;
}

const AddToCartButtons: React.FC<AddToCartButtonsProps> = ({ food_item }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.cart);

  const addToCart = (id: string) => {
    dispatch(updateCartItem([...cartItems, { itemId: id, itemName: food_item.itemName, quantity: 1 }]));
  };

  const removeFromCart = (id: string) => {
    dispatch(updateCartItem(cartItems.filter((cartItem) => cartItem.itemId !== id)));
  };

  const cartItem = cartItems.find((item) => item.itemId === food_item.id);

  return (
    <Box className="absolute bottom-3 right-3 flex items-center bg-white p-1 rounded-full shadow-md">
      {cartItem ? (
        <>
          <IconButton size="small" onClick={() => removeFromCart(food_item.id)}>
            <RemoveCircleIcon className="text-red-500" />
          </IconButton>
          <Typography variant="body2" className="px-2">{cartItem.quantity}</Typography>
          <IconButton size="small" onClick={() => addToCart(food_item.id)}>
            <AddCircleIcon className="text-green-500" />
          </IconButton>
        </>
      ) : (
        <IconButton size="small" onClick={() => addToCart(food_item.id)}>
          <AddCircleIcon className="text-blue-500" />
        </IconButton>
      )}
    </Box>
  );
};

export default AddToCartButtons;
