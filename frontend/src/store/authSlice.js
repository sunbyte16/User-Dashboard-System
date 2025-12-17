import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/api";

export const login = createAsyncThunk("auth/login", async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data.access_token;
});

export const signup = createAsyncThunk("auth/signup", async ({ email, username, password }) => {
  const { data } = await api.post("/auth/signup", { email, username, password });
  return data.access_token;
});

export const tryRefresh = createAsyncThunk("auth/tryRefresh", async () => {
  const { data } = await api.post("/auth/refresh");
  return data.access_token;
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
  const { data } = await api.get("/users/me");
  return data;
});

export const requestPasswordReset = createAsyncThunk("auth/requestReset", async ({ email }) => {
  const { data } = await api.post("/auth/request-reset-password", { email });
  return data.message;
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ token, new_password }) => {
  const { data } = await api.post("/auth/reset-password", { token, new_password });
  return data.message;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  const { data } = await api.post("/auth/logout");
  return data.message;
});

const slice = createSlice({
  name: "auth",
  initialState: { accessToken: null, user: null, status: "idle", error: null },
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(tryRefresh.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.user = null;
      });
  },
});

export const { setAccessToken, clearAuth } = slice.actions;
export default slice.reducer;
