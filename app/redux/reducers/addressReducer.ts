import { Address, UserAddress } from "@/app/utils/types/address_type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddressState {
  addressModel: boolean;
  address: Address;
  userAddress:  UserAddress | null;
  newAddress:UserAddress | null;
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addressModel: false,
  address: {},
  userAddress: null,
  newAddress :null,
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    fetchAddressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAddressSuccess: (state, action: PayloadAction<Address>) => {
      state.address = action.payload;
      state.loading = false;
    },
    fetchUserAddressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserAddressSuccess: (state, action: PayloadAction<UserAddress>) => {
      state.userAddress = (action.payload);
      state.loading = false;
    },
    fetchUserAddressFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserAddressStart: (state) => {
      state.loading = true;
    },
    updateUserAddress: (state, action: PayloadAction<UserAddress>) => {
      state.newAddress = action.payload;
      state.loading = false;
    },
    updateUserAddressSuccess: (state, action: PayloadAction<UserAddress>) => {
      state.userAddress = action.payload;
      state.loading = false;
    },
    updateuserAddressFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    openAddressModel: (state) => {
      state.loading = true;
      state.addressModel = true;
    },
    closeAddressModel: (state) => {
      state.loading = true;
      state.addressModel = false;
    },
  },
});

export const {
  fetchAddressStart,
  fetchAddressSuccess,
  fetchUserAddressStart,
  fetchUserAddressSuccess,
  fetchUserAddressFailure,
  updateUserAddress,
  updateUserAddressStart,
  updateUserAddressSuccess,
  updateuserAddressFailure,
  openAddressModel,
  closeAddressModel,
} = addressSlice.actions;
export default addressSlice.reducer;
