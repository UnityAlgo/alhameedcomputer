"use server";

import axios from 'axios';
import { redirect } from 'next/navigation';
import { API_URL } from '@/api/client';
import { setTokens } from '@/lib/tokens';

interface LoginState {
    success: boolean;
    error?: string;
    user?: {
        id: string;
        email: string;
        username: string;
        full_name?: string;
        mobile?: string;
        dob?: string;
    };
}

export async function login(
    prevState: LoginState | null,
    formData: FormData
): Promise<LoginState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return {
            success: false,
            error: 'Email and password are required'
        };
    }

    try {
        const response = await axios.post(API_URL + 'api/login', {
            email,
            password
        });

        const { tokens, user } = response.data;

        if (!tokens?.access || !tokens?.refresh) {
            return {
                success: false,
                error: 'Invalid response from server'
            };
        }

        // Store tokens in httpOnly cookies
        await setTokens({
            access: tokens.access,
            refresh: tokens.refresh
        });

        // Return success with user data
        // The redirect will happen after this returns
        return {
            success: true,
            user: user
        };

    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                error: error.response?.data?.message || 'Invalid login credentials'
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}
