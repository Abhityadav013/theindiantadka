import { createSlice } from "@reduxjs/toolkit";

interface AddressState {
  addressModel: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addressModel: false,
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

export const { fetchAddressStart, openAddressModel, closeAddressModel } =
  addressSlice.actions;
export default addressSlice.reducer;
