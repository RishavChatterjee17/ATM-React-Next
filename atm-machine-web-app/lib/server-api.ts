import type {
  User,
  TransactionsResponse,
} from './schemas/types';

const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getServerUserProfile(userId: string): Promise<{ success: boolean; user: User }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/user/profile`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || response.statusText || 'Failed to fetch user profile';
      throw new Error(errorMessage);
    }

    const data: { success: boolean; user: User } = await response.json();
    return data;
  } catch (error) {
    console.error('Get user profile server error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user profile';
    throw new Error(errorMessage);
  }
}

export async function getServerTransactions(userId: string): Promise<TransactionsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/transactions`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || response.statusText || 'Failed to fetch transactions';
      throw new Error(errorMessage);
    }

    const data: TransactionsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Get transactions server error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
    throw new Error(errorMessage);
  }
}

