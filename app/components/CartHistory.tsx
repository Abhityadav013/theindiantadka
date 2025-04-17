"use client";
import React, { useEffect, useState } from "react";
import { Button, Divider, Card, CardContent, Typography, Box, LinearProgress } from "@mui/material";
import { CartDescription } from "../utils/types/cart_type";
import { RootState } from "../redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { FoodItem } from "../utils/types/menu_type";
import Image from "next/image";
import { AppDispatch } from "../redux/store";
import { updateCartDescriptionItem, updateCartItem } from "../redux/reducers/cartReducer";
import CartDialog, { DescriptionSubmit } from "./CartDialog";

const CartHistory = () => { // Managing checkbox state
    const [isCustomizeModal, setCustomizeModal] = useState(false)
    const [fetchCart, setFetchCart] = useState<FoodItem[]>([]);
    const [isCartUpdated, setCartUpdated] = useState(false);

    const dispatch = useDispatch<AppDispatch>();

    const { cart, cartDescriptions,loading } = useSelector((state: RootState) => state.cart);
    const foodItems: FoodItem[] = useSelector((state: RootState) => state.menu.foodMenuItems);

    useEffect(() => {
        const filteredFoodItems = foodItems.filter((food) =>
            cart.some(cartItem => cartItem.itemId === food.id && cartItem.quantity > 0)
        );
        if (filteredFoodItems.length > 0) {
            setFetchCart(filteredFoodItems);
        }
    }, [foodItems, cart]);

    const addToCart = (id: string) => {
        const foodItem = foodItems.find((item) => item.id === id);
        if (!foodItem) return;

        const updatedCart = [...cart];
        const itemIndex = updatedCart.findIndex((cartItem) => cartItem.itemId === id);

        if (itemIndex > -1) {
            updatedCart[itemIndex] = { ...updatedCart[itemIndex], quantity: updatedCart[itemIndex].quantity + 1 };
        } else {
            updatedCart.push({ itemId: id, itemName: foodItem.itemName, quantity: 1 });
        }

        setCartUpdated(true);
        const timer = setTimeout(() => {
            dispatch(updateCartItem(updatedCart));
            setCartUpdated(false);
        }, 1000); // Show loading indicator for 1 second
        return () => clearTimeout(timer);
    };

    const removeFromCart = (id: string) => {
        const removeItem = cart.find((cartItem) => cartItem.itemId === id);

        if (!removeItem) return; // If item doesn't exist, return early

        const updatedCart = [...cart];
        const itemIndex = updatedCart.findIndex((cartItem) => cartItem.itemId === id);

        // Check if quantity is greater than 1, then decrease it
        if (removeItem.quantity > 1) {
            updatedCart[itemIndex] = {
                ...updatedCart[itemIndex],
                quantity: updatedCart[itemIndex].quantity - 1,
            };
        } else {
            // If quantity is 1, remove the item from the cart
            updatedCart.splice(itemIndex, 1);
        }

        setCartUpdated(true); // Set loading state to true

        // Simulate a delay (for loading indicator) and then update the cart in Redux
        const timer = setTimeout(() => {
            dispatch(updateCartItem(updatedCart)); // Dispatch the updated cart
            setCartUpdated(false); // Reset loading state
        }, 1000); // Show loading indicator for 1 second

        // Clean up the timeout when the component is unmounted or on next removal action
        return () => clearTimeout(timer);
    };

    const handleCustomizeModal = () => {
        setCustomizeModal(() => !isCustomizeModal)
    }
    const handleItemDescription = (value: DescriptionSubmit) => {
        const description: CartDescription = value.description
        dispatch(updateCartDescriptionItem(description))
    }

    return (
        <Card
            className="flex flex-col min-h-[100px] w-full justify-between items-center py-3 overflow-y-auto">
            <CardContent className="p-6">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <Image
                        src="https://testing.indiantadka.eu/assets/food.webp"
                        alt="Food image for the restaurant menu"
                        width={50}
                        height={50}
                        className="rounded"
                    />
                    <Typography variant="h6" className="font-bold text-gray-800">
                        Your Order
                    </Typography>
                </div>
                <div className="flex justify-between mb-2 text-sm font-semibold text-gray-600">
                    <div className="w-[55%]">Item Name</div>
                    <div className="w-[25%]">Qty</div>
                    <div className="w-[20%] text-right">Price</div>
                </div>
                <Divider className="my-2" />

                <Box className="flex flex-col min-h-[100px] justify-between items-center py-3 overflow-y-auto">
                    {isCartUpdated && <LinearProgress
                        sx={{
                            width: "100%",
                            height: "6px",
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: "tomato",
                            },
                            backgroundColor: "lightgray",
                            mb: 1,
                        }}
                    />}
                    {fetchCart.length === 0 && loading ? (
                        <LinearProgress sx={{ width: "100%", height: "6px", backgroundColor: "lightgray", mb: 1 }} />
                    ) : (
                        fetchCart.map((item, index) => {
                            const cartItem = cart.find(cartItem => cartItem.itemId === item.id);
                            const quantity = cartItem ? cartItem.quantity : 0;
                            const itemTotal = item.price * quantity;
                            const cartDescription = cartDescriptions.find(di => di.itemId === item.id);

                            return (
                                <div key={index} className="flex items-center justify-between gap-4 py-1 w-full">

                                    <div className="flex items-center w-full">
                                        <div className="flex-1 w-[50%]">
                                            <Typography variant="body2" className="text-gray-700 text-sm">
                                                {item.itemName}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                className="text-blue-500 cursor-pointer"
                                                onClick={() => setCustomizeModal(true)}
                                            >
                                                Customize
                                            </Typography>
                                            {isCustomizeModal && (
                                                <CartDialog
                                                    isOpen={isCustomizeModal}
                                                    onClose={handleCustomizeModal}
                                                    foodData={{ itemId: item.id, itemName: item.itemName }}
                                                    onSubmit={handleItemDescription}
                                                    cartDescription={String(cartDescription?.description || '')}
                                                />
                                            )}
                                        </div>
                                        <div className="w-[30%] flex items-center gap-4 justify-start">
                                            <div className="flex items-center border px-2 py-1 bg-white-100">
                                                <Button className="min-w-3 p-0 text-sm" onClick={() => removeFromCart(item.id)}>-</Button>
                                                <span className="text-sm ml-2 font-semibold text-green-600">{quantity}</span>
                                                <Button className="min-w-6 p-0 text-sm font-semibold text-green-600" onClick={() => addToCart(item.id)}>+</Button>
                                            </div>
                                        </div>

                                        {/* Price Section */}
                                        <div className="w-[15%] flex justify-end items-center">
                                            <Typography variant="body2" className="font-semibold text-gray-800 text-sm">
                                                €{itemTotal.toFixed(2)}  {/* Ensuring the price is formatted correctly */}
                                            </Typography>
                                        </div>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </Box>

            </CardContent>
        </Card>
    );
};

export default CartHistory;
