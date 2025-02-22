import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementAsyncSuccess: (state, action) => {
      state.value += action.payload; // Simulate async success update
    },
  },
});

export const { increment, decrement, incrementAsyncSuccess } = counterSlice.actions;
export default counterSlice.reducer;
