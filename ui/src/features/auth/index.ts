import { create, StoreApi, UseBoundStore } from 'zustand';
import { clearAuthCookies, setAuthCookies } from '@/lib/auth-actions';
import { useMutation } from '@tanstack/react-query';

import axios from 'axios';
import { API_URL } from '@/api';


type AuthTokens = {
    access: string;
    refresh: string;
}

interface AuthStore {
    user: { id: string; username: string; email: string } | null;
    tokens?: AuthTokens | null;
    login: (payload: { tokens: AuthTokens }) => void;
    logout: () => void;
}

const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    tokens: null,
    login: async (payload: { tokens: AuthTokens }) => set(() => {
        setAuthCookies(payload.tokens);
        return {
            tokens: payload.tokens,
        };
    }),
    logout: () => set(() => {
        clearAuthCookies();
        return {
            user: null,
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
