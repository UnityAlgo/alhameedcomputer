import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { create } from 'zustand';
import { useMutation } from '@tanstack/react-query';

import { API_URL } from '@/api';
import { safeLocalStorage } from '@/utils';

type User = {
    id: string;
    email: string;
    username: string;
    mobile?: string;
    dob?: string;
    full_name?: string;
}

type AuthTokens = {
    access: string;
    refresh: string;
}

interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    tokens?: AuthTokens | null;
    login: (payload: { tokens: AuthTokens }) => void;
    logout: () => void;
}

const getAuthTokens = () => {
    const tokens = safeLocalStorage.getItem("tokens");

    if (!tokens) {
        return null;
    }

    return JSON.parse(tokens) as AuthTokens;
}


const getUser = (): User | null => {
    const tokens = safeLocalStorage.getItem("tokens");

    if (!tokens) {
        return null;
    }

    const decoded = jwtDecode(JSON.parse(tokens).access) as User;
    return {
        email: decoded.email,
        id: decoded.id,
        username: decoded.username,
        full_name: decoded.full_name,
        mobile: decoded.mobile,
        dob: decoded.dob,
    };
}
const useAuthStore = create<AuthStore>((set, get) => ({
    tokens: getAuthTokens(),
    user: getUser(),
    isAuthenticated: !!getAuthTokens(),

    login: async (payload: { tokens: AuthTokens }) => set(() => {
        safeLocalStorage.setItem("tokens", JSON.stringify(payload.tokens));
        return {
            tokens: payload.tokens,
        };
    }),
    logout: () => set(() => {
        safeLocalStorage.removeItem("tokens");
        return {
            tokens: null,
        }
    }),
}));


export const useLogin = (state: AuthStore) => {
    return useMutation({
        mutationKey: ["login"],
        mutationFn: async (payload: { email: string; password: string }) => {
            return axios.post(API_URL + 'api/login', payload);
        },
        onSuccess: (response) => {
            const { tokens } = response.data;
            state.login({ tokens });
        }
    })
}


export default useAuthStore;
