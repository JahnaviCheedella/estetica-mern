import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
  name: "header",
  initialState: {
    headerSearchItem: "",
  },
  reducers: {
    changeHeaderSearchItem: (state, action) => {
      state.headerSearchItem = action.payload;
    },
  },
});

export const { changeHeaderSearchItem } = headerSlice.actions;
export const headerReducer = headerSlice.reducer;
