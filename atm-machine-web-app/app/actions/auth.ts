'use server';

import { redirect } from 'next/navigation';
import { setUserId } from '@/lib/auth';
import type { LoginResponse } from '@/lib/schemas/types';

const EXTERNAL_API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// login server action
export async function loginAction(
  cardType: 'visa' | 'mastercard',
  pin: string
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${EXTERNAL_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cardType, pin }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || response.statusText || 'Login failed';
      
      return {
        success: false,
        message: errorMessage,
      };
    }

    const data: LoginResponse = await response.json();
    
    if (data.success && data.user) {
      await setUserId(data.user.id);
    }
    
    return data;
  } catch (error) {
    console.error('Login action error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function logoutAction() {
  const { clearUserId } = await import('@/lib/auth');
  await clearUserId();
  redirect('/');
}

