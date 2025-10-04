"use client";
import { jwtDecode } from "jwt-decode";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthPayload {
  tokens: {
    access: string;
    refresh: string;
  };
  user: User;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthPayload>) => {
      const { tokens, user } = action.payload;
      state.accessToken = tokens.access;
      state.refreshToken = tokens.refresh;
      state.isAuthenticated = true;
      state.user = user; 

      localStorage.setItem("tokens", JSON.stringify(tokens));
      localStorage.setItem("user", JSON.stringify(user));
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("tokens");
      localStorage.removeItem("user");
    },

    loadFromStorage: (state) => {
      const tokens = localStorage.getItem("tokens");
      const user = localStorage.getItem("user");

      if (tokens && user) {
        try {
          state.accessToken = JSON.parse(tokens).access;
          state.refreshToken = JSON.parse(tokens).refresh;
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
        } catch (error) {
          console.error("Invalid storage data:", error);
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          localStorage.removeItem("tokens");
          localStorage.removeItem("user");
        }
      }
    },
  },
});

export const { setCredentials, logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
