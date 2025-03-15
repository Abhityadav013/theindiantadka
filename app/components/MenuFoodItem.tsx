"use client";

import React from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { FoodItem } from "../utils/types/menu_type";
import { Card, CardContent, Typography, Box, IconButton, Chip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { AppDispatch } from "../redux/store";
import { updateCartItem } from "../redux/reducers/cartReducer";

export interface MenuFoodItemProps {
  food_item: FoodItem;
}

const MenuFoodItem: React.FC<MenuFoodItemProps> = ({ food_item }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.cart);
  const { foodMenuItems } = useSelector((state: RootState) => state.menu);

  const addToCart = (id: string) => {
    const foodItem = foodMenuItems.find((item) => item.id === id);
    if (!foodItem) return;

    const updatedCart = [...cartItems];
    const itemIndex = updatedCart.findIndex((cartItem) => cartItem.itemId === id);

    if (itemIndex > -1) {
      updatedCart[itemIndex] = { ...updatedCart[itemIndex], quantity: updatedCart[itemIndex].quantity + 1 };
    } else {
      updatedCart.push({ itemId: id, itemName: foodItem.itemName, quantity: 1 });
    }
    dispatch(updateCartItem(updatedCart));
  };

  const removeFromCart = (id: string) => {
    const updatedCart = cartItems
      .map((cartItem) => cartItem.itemId === id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem)
      .filter((cartItem) => cartItem.quantity > 0);

    dispatch(updateCartItem(updatedCart));
  };
  
  return (
    <Card className="w-full max-w-xs rounded-lg shadow-md transition-transform hover:scale-105 flex flex-col">
    {/* Food Image */}
    <Box className="relative w-full h-[200px] overflow-hidden rounded-t-2xl">
      <Image
        src={food_item.imageURL}
        alt={food_item.itemName}
        fill={true}
        objectFit="cover"
        className="rounded-t-lg object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      <Box className="absolute bottom-3 right-3 flex items-center bg-white p-1 rounded-full shadow-md">
        {cartItems.find((cartItem) => cartItem.itemId === food_item.id) ? (
          <>
            <IconButton size="small" onClick={() => removeFromCart(food_item.id)}>
              <RemoveCircleIcon className="text-red-500" />
            </IconButton>
            <Typography variant="body2" className="px-2">
              {cartItems.find((cartItem) => cartItem.itemId === food_item.id)?.quantity}
            </Typography>
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
    </Box>

    {/* Food Details */}
    <CardContent className="p-3 flex flex-col justify-between flex-grow">
      <Typography variant="h6" className="font-medium text-sm sm:text-base">
        {food_item.itemName}
      </Typography>

      <Typography variant="body2" color="textSecondary" className="text-xs sm:text-sm mt-1">
        {food_item.description || "No description available."} {/* Default description */}
      </Typography>

      <Typography
        variant="h6"
        className="text-red-500 font-semibold mt-2 text-sm sm:text-base"
        sx={{
          display: "flex",          // Use flexbox to align items in a row
          justifyContent: "space-between", // Space between the items
          alignItems: "center",     // Vertically align items
          width: "100%",            // Make sure the full width is used
        }}
      >
        € {food_item.price}
        <Image
          src="https://testing.indiantadka.eu/assets/rating_starts.png"
          alt="rating"
          width={70}
          height={15}
        />
      </Typography>

      <Box className="flex flex-wrap gap-2 mt-2">
        {food_item.tags?.map((tag, index) => (
          <Chip key={index} label={tag} className="bg-gray-200 text-green-600" size="small" />
        ))}
      </Box>
    </CardContent>
  </Card>
  );
};

export default MenuFoodItem;
