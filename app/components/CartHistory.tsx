"use client";
import React, { useMemo, useState } from "react";
import { Button, Divider, Checkbox, Card, CardContent, Typography } from "@mui/material";
import { CartDescription } from "../utils/types/cart_type";
import { RootState } from "../redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { FoodItem } from "../utils/types/menu_type";
import Image from "next/image";
import { AppDispatch } from "../redux/store";
import { updateCartDescriptionItem, updateCartItem } from "../redux/reducers/cartReducer";
import CartDialog, { DescriptionSubmit } from "./CartDialog";

const CartHistory = () => {
    const [deliveryFee] = useState(2);
    const [noContactDelivery, setNoContactDelivery] = useState(false); // Managing checkbox state
    const [isCustomizeModal, setCustomizeModal] = useState(false)
    const dispatch = useDispatch<AppDispatch>();

    const {cart,cartDescriptions} = useSelector((state: RootState) => state.cart);
    const foodItems: FoodItem[] = useSelector((state: RootState) => state.menu.foodMenuItems);

    const gstAndRestaurantCharges = 10; // You can make this dynamic if needed

    // Memoizing the cart total calculation
    const cartTotal = useMemo(() => {
        return cart.reduce((total, cartItem) => {
            const foodItemMatch = foodItems.find(item => item.id === cartItem.itemId);
            return foodItemMatch ? total + foodItemMatch.price * cartItem.quantity : total;
        }, 0);
    }, [cart, foodItems]);

    const filteredFoodItems = foodItems.filter((food) =>
        cart.some(cartItem => cartItem.itemId === food.id && cartItem.quantity > 0)
    );

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
        dispatch(updateCartItem(updatedCart));
    };

    const removeFromCart = (id: string) => {
        const updatedCart = cart
            .map((cartItem) => cartItem.itemId === id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem)
        // .filter((cartItem) => cartItem.quantity > 0);

        dispatch(updateCartItem(updatedCart));
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNoContactDelivery(event.target.checked);
    };

    const handleCustomizeModal = () => {
        setCustomizeModal(() => !isCustomizeModal)
    }
    const handleItemDescription = (value: DescriptionSubmit) => {
        const description:CartDescription =value.description
        dispatch(updateCartDescriptionItem(description))
    }

    return (
        <Card className="max-w-md sm:max-w-lg mx-auto bg-white shadow-lg rounded-lg border">
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
                <Divider className="my-2" />

                {filteredFoodItems.map((item, index) => {
                    const cartItem = cart.find(cartItem => cartItem.itemId === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;
                    const itemTotal = item.price * quantity;
                 
                    const cartDescription= cartDescriptions.find((di) => di.itemId === item.id)
                    return (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center w-[100px]">
                                <div>
                                    <Typography variant="body2" className="text-gray-700 text-sm">
                                        {item.itemName}
                                    </Typography>
                                    <Typography variant="caption" className="text-blue-500 cursor-pointer" onClick={() => setCustomizeModal(true)}>Customize</Typography>
                                    {
                                        isCustomizeModal && (
                                            <CartDialog isOpen={isCustomizeModal} onClose={handleCustomizeModal} foodData={{ itemId: item.id, itemName: item.itemName }} onSubmit={handleItemDescription} cartDescription={String(cartDescription?.description ||'')} />
                                        )
                                    }
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex w-[60px] items-center border px-2 py-1 bg-white-100 mr-3">
                                    <Button className="min-w-3 p-0 text-sm" onClick={() => removeFromCart(item.id)}>-</Button>
                                    <span className="text-sm ml-2 font-semibold text-green-600">
                                        {quantity}
                                    </span>
                                    <Button className="min-w-6 p-0 text-sm font-semibold text-green-600" onClick={() => addToCart(item.id)}>+</Button>
                                </div>
                                <Typography variant="body2" className="font-semibold text-gray-800 text-sm">
                                    €{itemTotal}
                                </Typography>
                            </div>
                        </div>
                    );
                })}

                <Divider className="my-4" />
                <div className="flex items-start gap-2">
                    <Checkbox checked={noContactDelivery} onChange={handleCheckboxChange} />
                    <Typography variant="body2" className="text-gray-700">
                        <strong>Opt in for No-contact Delivery</strong>
                        <br />Unwell, or avoiding contact? Please select no-contact delivery.
                    </Typography>
                </div>

                <Divider className="my-4" />

                {/* Bill Details */}
                <div className="text-sm text-gray-700">
                    <div className="flex justify-between mb-2">
                        <Typography>Item Total</Typography>
                        <Typography>€{cartTotal}</Typography>
                    </div>
                    <div className="flex justify-between mb-2">
                        <Typography>Delivery Fee</Typography>
                        <Typography>€{deliveryFee}</Typography>
                    </div>
                    <div className="flex justify-between mb-2">
                        <Typography>Platform Fee</Typography>
                        <Typography>€{cartTotal + deliveryFee}</Typography>
                    </div>
                    <div className="flex justify-between mb-2">
                        <Typography>GST and Restaurant Charges</Typography>
                        <Typography>€{gstAndRestaurantCharges}</Typography>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                        <Typography>TO PAY</Typography>
                        <Typography>€{cartTotal + deliveryFee + gstAndRestaurantCharges}</Typography>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CartHistory;
