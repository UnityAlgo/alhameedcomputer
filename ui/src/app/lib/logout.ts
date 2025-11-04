"use server";

import { redirect } from 'next/navigation';
import { clearTokens, getAccessToken } from '@/lib/tokens';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

/**
 * Server action to logout user
 * Calls backend logout endpoint and clears authentication tokens
 */
export async function logout(): Promise<void> {
    try {
        const accessToken = await getAccessToken();
        
        // Call backend logout endpoint to invalidate session
        if (accessToken) {
            await axios.post(
                `${API_URL}api/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
        }
    } catch (error) {
        // Log error but continue with logout
        console.error('Backend logout error:', error);
    } finally {
        // Always clear tokens from cookies
        await clearTokens();
    }
    
    redirect('/login');
}

