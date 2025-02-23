import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart, CartDescription } from "@/app/utils/types/cart_type";

interface CartState  {
  cart: Cart[];
  cartDescription:CartDescription | null;
  cartDescriptions:CartDescription[]
  cartTotal: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: [],
  cartDescription:null,
  cartDescriptions:[],
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
    fetchCartDescriptionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCartDescriptionSuccess: (state, action: PayloadAction<CartDescription[]>) => {
      state.cartDescriptions = action.payload;
      state.loading = false;
    },
    fetchCartDescriptionFailure: (state, action: PayloadAction<string>) => {
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
    updateCartDescriptionItem: (state, action: PayloadAction<CartDescription>) => {
      state.loading = true;
      state.cartDescription = action.payload ;
    },
    updateCartDescriptionSuccess: (state, action: PayloadAction<CartDescription[]>) => {
      state.cartDescriptions = action.payload ;
      state.loading = false;
    },
  },
});

export const {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  fetchCartDescriptionStart,
  fetchCartDescriptionSuccess,
  fetchCartDescriptionFailure,
  updateCartStart,
  updateCartItem,
  updateCartSuccess,
  updateCartFailure,
  updateCartDescriptionItem,
  updateCartDescriptionSuccess
} = cartSlice.actions;

export default cartSlice.reducer;
