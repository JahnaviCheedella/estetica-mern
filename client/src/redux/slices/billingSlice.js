import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchBillingDetails = createAsyncThunk(
  "billing/fetchBillingDetails",
  async () => {
    const response = await fetch("http://localhost:5000/cart");
    if (!response.ok) throw new Error("Failed to fetch billing details");
    const data = await response.json();
    return data;
  }
);

const billingSlice = createSlice({
  name: "billing",
  initialState: {
    billingDetails: [],
    serviceTotal: 0,
    productTotal: 0,
    finalTotalAfterDiscount: 0,
    taxAmount: 0,
    grandTotal: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBillingDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        const payload = action.payload || {};
        state.billingDetails = payload.filteredCartItems || [];
        state.serviceTotal = payload.serviceTotal || 0;
        state.productTotal = payload.productTotal || 0;
        state.finalTotalAfterDiscount = payload.finalTotalAfterDiscount || 0;
        state.taxAmount = payload.taxAmount || 0;
        state.grandTotal = payload.grandTotal || 0;
      })
      .addCase(fetchBillingDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message;
      });
  },
});

// no reducers to export currently
export default billingSlice.reducer;
