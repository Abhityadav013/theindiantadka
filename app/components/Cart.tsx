import React, {  useEffect, useState } from "react";
import {useRouter} from 'next/navigation'
import { Button, Box, Divider, Typography, TextField } from "@mui/material";

const Cart = () => {
  const navigate = useRouter();
  const [deliveryFee] = useState(2);

  useEffect(() => {
    console.log("Cart Component Loaded");
  }, []);

  return (
    <div className="mt-24">
      {/* {userDetails && <EmailVerificationAlert user={userDetails} />} */}
      <Box className="cart-items mt-6 p-4 bg-white shadow-md rounded-lg">
        <div className="flex justify-between text-gray-500 text-xs">
          <Typography variant="body1" className="flex-1">Title</Typography>
          <Typography variant="body1" className="flex-1">Price</Typography>
          <Typography variant="body1" className="flex-1">Quantity</Typography>
          <Typography variant="body1" className="flex-1">Total</Typography>
          <Typography variant="body1" className="flex-0.5">Remove</Typography>
        </div>
        <Divider className="my-4" />
        {/* {food_list.map((item, index) => {
          if (cartItems[item.id] > 0) {
            return (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <Image src={item.imageURL} alt={item.itemName} className="w-12 h-12 object-cover" />
                <Typography variant="body2" className="flex-1">{item.itemName}</Typography>
                <Typography variant="body2" className="flex-1">${item.price}</Typography>
                <Typography variant="body2" className="flex-1">{cartItems[item.id]}</Typography>
                <Typography variant="body2" className="flex-1">${item.price * cartItems[item.id]}</Typography>
                <Button
                  variant="text"
                  color="error"
                //   onClick={() => removeFromCart(item.id)}
                  className="text-red-500"
                >
                  X
                </Button>
              </div>
            );
          }
          return null;
        })} */}
      </Box>

      <Box className="cart-bottom mt-12 flex justify-between gap-6">
        <Box className="cart-total flex-1 flex flex-col gap-6 p-4 bg-white shadow-md rounded-lg">
          <Typography variant="h6">Cart Totals</Typography>
          <div className="flex justify-between text-gray-600">
            <Typography variant="body2">SubTotal</Typography>
            <Typography variant="body2">${}</Typography>
          </div>
          <Divider />
          <div className="flex justify-between text-gray-600">
            <Typography variant="body2">Delivery Fee</Typography>
            <Typography variant="body2">${deliveryFee}</Typography>
          </div>
          <Divider />
          <div className="flex justify-between font-bold">
            <Typography variant="body2">Total</Typography>
            <Typography variant="body2">${}</Typography>
          </div>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate.push("/order")}
            className="w-full mt-4"
          >
            PROCEED TO CHECKOUT
          </Button>
        </Box>

        <Box className="cart-promocode flex-1 p-4 bg-white shadow-md rounded-lg">
          <Typography variant="body2" color="textSecondary">
            If you have a promo code, Enter it here
          </Typography>
          <div className="flex items-center mt-4 gap-2">
            <TextField
              label="Promo Code"
              variant="outlined"
              fullWidth
              size="small"
              className="bg-gray-100"
            />
            <Button variant="contained" color="primary" className="w-auto">
              Submit
            </Button>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default Cart;
