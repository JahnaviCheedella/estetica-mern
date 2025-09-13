import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const userAuth = createAsyncThunk(
  "auth/userAuth",
  async ({ username, password, mode }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, mode }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || "Authentication failed");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    username: "",
    password: "",
    isLoggedIn: false,
    status: "idle",
    message: null,
    error: null,
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    loginSuccess: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.username = "";
      state.password = "";
      state.isLoggedIn = false;
      state.message = null;
      state.error = null;
    },
    resetAuth: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userAuth.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(userAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(userAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      });
  },
});

export const { setUsername, setPassword, loginSuccess, logout, resetAuth } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
