import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  category: string;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  category: "All",
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    fetchCategoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategorySuccess: (
      state,
      action: PayloadAction<{
        category: string;
      }>
    ) => {
      state.category = action.payload.category;
      state.loading = false;
    },
    fetchCategoryFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchCategoryStart,
  fetchCategorySuccess,
  fetchCategoryFailure,
} = categorySlice.actions;
export default categorySlice.reducer;
