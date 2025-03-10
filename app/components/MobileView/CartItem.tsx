import { Box, Button, InputAdornment, LinearProgress, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CartDialog, { DescriptionSubmit } from '../CartDialog';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { RootState } from '@/app/redux/reducers';
import { FoodItem } from '@/app/utils/types/menu_type';
import { updateCartDescriptionItem, updateCartItem } from '@/app/redux/reducers/cartReducer';
import { CartDescription } from '@/app/utils/types/cart_type';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { Divider } from 'antd';

const CartItem = () => {
  const [isCustomizeModal, setCustomizeModal] = useState(false);
  const [text, setText] = useState("");
  const [fetchCart, setFetchCart] = useState<FoodItem[]>([]);
  const [isCartUpdated, setCartUpdated] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const { cart, cartDescriptions, loading } = useSelector((state: RootState) => state.cart);
  const foodItems: FoodItem[] = useSelector((state: RootState) => state.menu.foodMenuItems);

  useEffect(() => {
    const filteredFoodItems = foodItems.filter((food) =>
      cart.some(cartItem => cartItem.itemId === food.id && cartItem.quantity > 0)
    );
    if(filteredFoodItems.length > 0) {
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
    if (removeItem) {
      const updatedCart = {
        ...removeItem,
        quantity: removeItem.quantity - 1,
      };
      
      setCartUpdated(true);
      const timer = setTimeout(() => {
        dispatch(updateCartItem([updatedCart]));
        setCartUpdated(false);
      }, 800); // Show loading indicator for 1 second
      return () => clearTimeout(timer);
    }
  };

  const handleCustomizeModal = () => {
    setCustomizeModal(() => !isCustomizeModal);
  };

  const handleItemDescription = (value: DescriptionSubmit) => {
    const description: CartDescription = value.description;
    dispatch(updateCartDescriptionItem(description));
  };

  useEffect(() => {
    const savedText = localStorage.getItem("restaurantSuggestion");
    if (savedText) {
      setText(savedText);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    localStorage.setItem("restaurantSuggestion", event.target.value);
  };

  return (
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
            <div key={index} className="flex items-center justify-between w-full">
              <div className="flex items-center w-full">
                <div className="flex-grow">
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
                <div className="flex items-center">
                  <div className="flex w-[60px] items-center border px-2 py-1 bg-white-100 mr-3">
                    <Button className="min-w-3 p-0 text-sm" onClick={() => removeFromCart(item.id)}>
                      -
                    </Button>
                    <span className="text-sm ml-2 font-semibold text-green-600">{quantity}</span>
                    <Button className="min-w-6 p-0 text-sm font-semibold text-green-600" onClick={() => addToCart(item.id)}>
                      +
                    </Button>
                  </div>
                  <Typography variant="body2" className="font-semibold text-gray-800 text-sm">
                    €{itemTotal}
                  </Typography>
                </div>
              </div>
            </div>
          );
        })
      )}
      <Divider className="mt-4 mb-4" style={{ border: "1px solid rgba(2, 6, 12, .1)" }} />
      <TextField
        fullWidth
        placeholder="Write Suggestion to restaurant..."
        onChange={handleChange}
        value={text}
        variant="standard"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ReceiptIcon />
            </InputAdornment>
          ),
          disableUnderline: true,
        }}
      />
    </Box>
  );
};

export default CartItem;
