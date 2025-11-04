"use server";

import axios from 'axios';
import { getTokens, setTokens, clearTokens } from '@/lib/tokens';

const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

/**
 * Server action to refresh the access token
 * This should be called when the access token expires
 */
export async function refreshAccessToken(): Promise<boolean> {
    try {
        const tokens = await getTokens();
        
        if (!tokens?.refresh) {
            return false;
        }

        const response = await axios.post(
            `${API_URL}api/login/refresh`,
            { refresh: tokens.refresh }
        );

        if (response.status === 200 && response.data.access) {
            // Update tokens (may include new refresh token if rotation is enabled)
            await setTokens({
                access: response.data.access,
                refresh: response.data.refresh || tokens.refresh, // Use new refresh if provided, otherwise keep old one
            });
            
            return true;
        }

        return false;
    } catch (error) {
        console.error('Token refresh failed:', error);
        // Clear invalid tokens
        await clearTokens();
        return false;
    }
}
