import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MobileViewState {
    mobileView: boolean;
    loading: boolean;
    isMobile: boolean;
}

const initialState: MobileViewState = {
    mobileView: false,
    loading: false,
    isMobile: false,
};

const mobileViewSlice = createSlice({
  name: "mobileView",
  initialState,
  reducers: {
    setMobileViewStart: (state) => {
        state.loading = true;
      },
    setMobileView: (state, action: PayloadAction<boolean>) => {
      state.mobileView = action.payload;
      state.loading = false;
    },
  },
});

export const { setMobileViewStart, setMobileView } = mobileViewSlice.actions;
export default mobileViewSlice.reducer;
