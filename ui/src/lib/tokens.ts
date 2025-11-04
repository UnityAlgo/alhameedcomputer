"use server";

import "server-only";
import { cookies } from 'next/headers';

export interface Tokens {
    access: string;
    refresh: string;
}

/**
 * Set authentication tokens in httpOnly cookies
 */
export async function setTokens(tokens: Tokens): Promise<void> {
    const cookieStore = await cookies();
    
    cookieStore.set("access_token", tokens.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 15, // 15 minutes (should match or be slightly longer than ACCESS_TOKEN_LIFETIME)
        path: '/'
    });

    cookieStore.set("refresh_token", tokens.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
    });
}

/**
 * Get authentication tokens from cookies
 */
export async function getTokens(): Promise<Tokens | null> {
    const cookieStore = await cookies();
    
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!accessToken || !refreshToken) {
        return null;
    }

    console.log("Access Token:", accessToken);
    return {
        access: accessToken,
        refresh: refreshToken
    };
}

/**
 * Get only the access token
 */
export async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("access_token")?.value || null;
}

/**
 * Clear all authentication tokens
 */
export async function clearTokens(): Promise<void> {
    const cookieStore = await cookies();
    
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
}

/**
 * Update only the access token (for token refresh)
 */
export async function updateAccessToken(accessToken: string): Promise<void> {
    const cookieStore = await cookies();
    
    cookieStore.set("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 15, // 15 minutes
        path: '/'
    });
}
