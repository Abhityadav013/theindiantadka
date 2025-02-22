import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart } from "@/app/utils/types/cart_type";

interface CartState  {
  cart: Cart[];
  cartTotal: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: [],
  cartTotal: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    fetchCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCartSuccess: (state, action: PayloadAction<Cart[]>) => {
      state.cart = action.payload;
      state.loading = false;
    },
    fetchCartFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateCartStart: (state) => {
      state.loading = true;
    },
    updateCartItem: (state, action: PayloadAction<Cart[]>) => {
      state.loading = true;
      state.cart = action.payload;
    },
    updateCartSuccess: (state, action: PayloadAction<Cart[]>) => {
      state.cart = action.payload;
      state.loading = false;
    },
    updateCartFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  updateCartStart,
  updateCartItem,
  updateCartSuccess,
  updateCartFailure,
} = cartSlice.actions;

export default cartSlice.reducer;
