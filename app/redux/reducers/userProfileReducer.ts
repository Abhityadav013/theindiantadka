import { UserProfile } from "@/app/utils/types/user_details";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  profile: UserProfile;
  otpExpireAt: number;
  otpModal: boolean;
  loginModal: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: {
    name: "",
    isAccountVerified: false,
  },
  otpExpireAt: 0,
  otpModal: false,
  loginModal: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.loading = false;
    },
    fetchOTPStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOTPSuccess: (state, action: PayloadAction<number>) => {
      state.otpExpireAt = action.payload;
      state.loading = false;
    },
    openOTPModel: (state) => {
      state.loading = true;
      state.otpModal = true;
    },
    closeOTPModel: (state) => {
      state.loading = true;
      state.otpModal = false;
    },
    setLoginModal: (state, action: PayloadAction<boolean>) => {
      state.loginModal = action.payload;
    },
  },
});

export const {
  fetchUserStart,
  fetchUserSuccess,
  fetchOTPStart,
  fetchOTPSuccess,
  openOTPModel,
  closeOTPModel,
  setLoginModal
} = userSlice.actions;
export default userSlice.reducer;
