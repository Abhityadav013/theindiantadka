// store/slices/userSlice.ts
import { UserLocation, UserState } from "@/app/utils/types/user_location_type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
  userLocation: null,
  isLoading: false,
};

const userLocationSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserLocation: (state, action: PayloadAction<UserLocation>) => {
      state.userLocation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUserLocation, setLoading } = userLocationSlice.actions;
export default userLocationSlice.reducer;
