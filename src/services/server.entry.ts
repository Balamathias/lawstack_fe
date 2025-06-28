'use server'

import axios, { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_URL } from './utils';

interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      requestId: string;
      timestamp: number;
    };
  }
}

const serverClient = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<string> | null = null;

serverClient.interceptors.request.use(
  async (config) => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      config.metadata = { 
        requestId: Math.random().toString(36).substring(7),
        timestamp: Date.now()
      };

      if (config.url?.includes('/quizzes/')) {
        console.log(`[${config.metadata.requestId}] Quiz API request:`, config.method?.toUpperCase(), config.url);
      }

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

serverClient.interceptors.response.use(
  (response) => {
    const requestId = response.config.metadata?.requestId;
    if (requestId) {
      console.log(`[${requestId}] Response:`, response.status);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; metadata?: any };
    const requestId = originalRequest?.metadata?.requestId || 'unknown';

    console.error(`[${requestId}] API Error:`, {
      status: error.response?.status,
      url: originalRequest?.url,
      message: error.message
    });

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await (refreshPromise || refreshAccessToken());
        
        if (newToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          console.log(`[${requestId}] Retrying with new token`);
          return serverClient(originalRequest);
        }
      } catch (refreshError) {
        console.error(`[${requestId}] Token refresh failed:`, refreshError);
        await clearAuthCookies();
        redirect('/login');
      }
    }

    if ((error.response?.status ?? 0) >= 500) {
      console.error(`[${requestId}] Server error:`, error.response?.status);
    }

    return Promise.reject(error);
  }
);

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('refresh_token')?.value;

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('Attempting to refresh access token...');
      
      const response = await axios.post<RefreshTokenResponse>(
        `${API_URL}/auth/refresh/`,
        { refresh: refreshToken },
        { 
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const { access: newToken, refresh: newRefreshToken } = response.data;

      if (!newToken) {
        throw new Error('Invalid token response');
      }

      await updateAuthCookies(newToken, newRefreshToken || refreshToken);
      
      console.log('Token refreshed successfully');
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function updateAuthCookies(accessToken: string, refreshToken: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    
    cookieStore.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15
    });

    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });
  } catch (error) {
    console.error('Failed to update auth cookies:', error);
    throw error;
  }
}

async function clearAuthCookies(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    cookieStore.delete('refresh_token');
    console.log('Auth cookies cleared');
  } catch (error) {
    console.error('Failed to clear auth cookies:', error);
  }
}

export { serverClient as stackbase };
