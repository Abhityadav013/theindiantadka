import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilteredMenuItem, FoodItem } from "../../utils/types/menu_type";

interface MenuState {
  foodMenuItems: FoodItem[];
  foodCategoryItems: FilteredMenuItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  foodMenuItems: [],
  foodCategoryItems: [],
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    fetchMenuStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMenuSuccess: (state, action: PayloadAction<{ foodMenuItems: FoodItem[]; foodCategoryItems: FilteredMenuItem[] }>) => {
      state.foodMenuItems = action.payload.foodMenuItems.filter(({isDelivery}) => isDelivery);
      state.foodCategoryItems = action.payload.foodCategoryItems;
      state.loading = false;
    },
    fetchMenuFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchMenuStart, fetchMenuSuccess, fetchMenuFailure } = menuSlice.actions;
export default menuSlice.reducer;
