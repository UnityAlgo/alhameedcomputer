"use client";
import { jwtDecode } from "jwt-decode";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { safeLocalStorage } from "@/utils";

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
  // isLoading: boolean; // Add loading state
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
  // isLoading: true,
};

const getInitialState = (): AuthState => {
  const tokens = safeLocalStorage.getItem("tokens") ? JSON.parse(safeLocalStorage.getItem("tokens") as string) : null
  const user = safeLocalStorage.getItem("user") ? JSON.parse(safeLocalStorage.getItem("user") as string) : null
  if (!user || !tokens) {
    return {
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    }
  }
  return {
    isAuthenticated: true,
    user,
    accessToken: tokens.access,
    refreshToken: tokens.refresh,
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    login: (state, action: PayloadAction<AuthPayload>) => {
      const { tokens, user } = action.payload;

      state.accessToken = tokens.access;
      state.refreshToken = tokens.refresh;
      state.isAuthenticated = true;
      state.user = user;
      // state.isLoading = false; // Set loading to false after login

      safeLocalStorage.setItem("tokens", JSON.stringify(tokens));
      safeLocalStorage.setItem("user", JSON.stringify(user));
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      // state.isLoading = false; // Keep loading false
      safeLocalStorage.removeItem("tokens");
      safeLocalStorage.removeItem("user");
    },

    loadFromStorage: (state) => {
      const tokens = safeLocalStorage.getItem("tokens");
      const user = safeLocalStorage.getItem("user");

      if (tokens && user) {
        try {
          const parsedTokens = JSON.parse(tokens);
          const parsedUser = JSON.parse(user);

          // Optional: Validate token expiration
          const decodedToken: any = jwtDecode(parsedTokens.access);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp && decodedToken.exp < currentTime) {
            // Token expired, clear storage
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            safeLocalStorage.removeItem("tokens");
            safeLocalStorage.removeItem("user");
          } else {
            // Token valid, load user data
            state.accessToken = parsedTokens.access;
            state.refreshToken = parsedTokens.refresh;
            state.user = parsedUser;
            state.isAuthenticated = true;
          }
        } catch (error) {
          console.error("Invalid storage data:", error);
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          safeLocalStorage.removeItem("tokens");
          safeLocalStorage.removeItem("user");
        }
      }

      // Always set loading to false after checking
      // state.isLoading = false;
    },
  },
});

export const { login, logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;