// server actions for operations we can perform

'use server';

import { revalidatePath } from 'next/cache';
import type {
  DepositResponse,
  WithdrawResponse,
  TransferRequest,
  TransferResponse,
} from '@/lib/schemas/types';

const EXTERNAL_API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function depositAction(
  userId: string,
  accountId: string,
  amount: number
): Promise<DepositResponse> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_URL}/api/transactions/deposit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ accountId, amount }),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || response.statusText || 'Deposit failed';
      throw new Error(errorMessage);
    }

    const data: DepositResponse = await response.json();
    
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/deposit');
    
    return data;
  } catch (error) {
    console.error('Deposit action error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Deposit failed';
    throw new Error(errorMessage);
  }
}

export async function withdrawAction(
  userId: string,
  accountId: string,
  amount: number
): Promise<WithdrawResponse> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_URL}/api/transactions/withdraw`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ accountId, amount }),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || response.statusText || 'Withdrawal failed';
      throw new Error(errorMessage);
    }

    const data: WithdrawResponse = await response.json();
    
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/withdraw');
    
    return data;
  } catch (error) {
    console.error('Withdraw action error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Withdrawal failed';
    throw new Error(errorMessage);
  }
}

export async function transferAction(
  userId: string,
  request: TransferRequest
): Promise<TransferResponse> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_URL}/api/transactions/transfer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(request),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || response.statusText || 'Transfer failed';
      throw new Error(errorMessage);
    }

    const data: TransferResponse = await response.json();
    
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/transfer');
    revalidatePath('/dashboard/transactions');
    
    return data;
  } catch (error) {
    console.error('Transfer action error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Transfer failed';
    throw new Error(errorMessage);
  }
}

