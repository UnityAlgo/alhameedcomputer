"use server";

import "server-only";
import axios from "axios";
import { getAccessToken, getTokens } from "@/lib/tokens";

const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

export interface User {
    id: string;
    email: string;
    username: string;
    mobile?: string;
    dob?: string;
    full_name?: string;
}

/**
 * Get the current authenticated user from the server
 * This should be called from server components or server actions
 */
export async function getUser(): Promise<User | null> {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return null;
        }

        const response = await axios.get(`${API_URL}api/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });


        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

/**
 * Check if user is authenticated by verifying token existence
 */
export async function isAuthenticated(): Promise<boolean> {
    const tokens = await getTokens();
    return tokens !== null;
}

/**
 * Validate authentication and return user or null
 */
export async function validateAuth(): Promise<User | null> {
    const authenticated = await isAuthenticated();
    
    if (!authenticated) {
        return null;
    }

    return await getUser();
}