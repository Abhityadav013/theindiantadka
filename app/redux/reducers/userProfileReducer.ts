import { UserProfile } from "@/app/utils/types/user_details";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
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
  },
});

export const { fetchUserStart, fetchUserSuccess } = userSlice.actions;
export default userSlice.reducer;
