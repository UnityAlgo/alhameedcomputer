"use client"

import { create } from 'zustand';

type User = {
    id: string;
    email: string;
    username: string;
    mobile?: string;
    dob?: string;
    full_name?: string;
}

interface AuthStore {
    user: User | null;
    setUser: (user: User | null) => void;
    clearUser: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));

export default useAuthStore;