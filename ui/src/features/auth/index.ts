"use client";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/api";

export type User = {
    id: string;
    email: string;
    username: string;
    mobile?: string;
    dob?: string;
    full_name?: string;
};

export type AuthTokens = {
    access: string;
    refresh: string;
};

interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    tokens: AuthTokens | null;
    isInitialized: boolean;
    login: (tokens: AuthTokens) => void;
    logout: () => void;
    initialize: () => void;
}

const isBrowser = typeof window !== "undefined";

const getAuthTokens = (): AuthTokens | null => {
    if (!isBrowser) return null;
    try {
        const tokens = localStorage.getItem("tokens");
        if (!tokens) return null;
        return JSON.parse(tokens);
    } catch {
        return null;
    }
};

const decodeUser = (tokens: AuthTokens | null): User | null => {
    if (!tokens?.access) return null;
    try {
        const decoded: any = jwtDecode(tokens.access);
        return {
            id: decoded.id,
            email: decoded.email,
            username: decoded.username,
            full_name: decoded.full_name,
            mobile: decoded.mobile,
            dob: decoded.dob,
        };
    } catch {
        return null;
    }
};

export const useAuthStore = create<AuthStore>((set, get) => ({
    tokens: null,
    user: null,
    isAuthenticated: false,
    isInitialized: false,

    login: (tokens: AuthTokens) => {
        if (isBrowser) {
            localStorage.setItem("tokens", JSON.stringify(tokens));
        }
        const user = decodeUser(tokens);
        set({
            tokens,
            user,
            isAuthenticated: true,
            isInitialized: true,
        });
    },

    logout: () => {
        if (isBrowser) {
            localStorage.removeItem("tokens");
        }
        set({
            tokens: null,
            user: null,
            isAuthenticated: false,
        });
    },

    initialize: () => {
        if (get().isInitialized) return;

        const tokens = getAuthTokens();
        const user = decodeUser(tokens);
        set({
            tokens,
            user,
            isAuthenticated: !!tokens,
            isInitialized: true,
        });
    },
}));

if (isBrowser) {
    useAuthStore.getState().initialize();
}

export const useLoginMutation = (state: AuthStore) => {
    return useMutation({
        mutationKey: ["login"],
        mutationFn: async (payload: { email: string; password: string }) => {
            const response = await axios.post(`${API_URL}api/login`, payload);
            return response.data;
        },
        onSuccess: (data) => {
            if (data?.tokens) {
                state.login(data.tokens);
            }
        },
    });
};

export default useAuthStore;