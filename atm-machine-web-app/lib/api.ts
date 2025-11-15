// client side api wrapper

import axios from 'axios';
import type {
  HealthCheckResponse,
  LoginResponse,
  DepositResponse,
  WithdrawResponse,
  TransferRequest,
  TransferResponse,
} from './schemas/types';

import { loginAction } from '@/app/actions/auth';
import { depositAction, withdrawAction, transferAction } from '@/app/actions/transactions';

export type {
  HealthCheckResponse,
  LoginResponse,
  DepositResponse,
  WithdrawResponse,
  TransferRequest,
  TransferResponse,
} from './schemas/types';

const apiClient = axios.create({
  // sending it ot client side api route as in Localhost:3000/api/health - where next router will handle it and send it to the actual server api route
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await apiClient.get<HealthCheckResponse>('/health');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to check server health'
      );
    }
    throw error;
  }
};

// server actions wrapped
export const login = async (cardType: 'visa' | 'mastercard', pin: string): Promise<LoginResponse> => {
  // we can add some client side logic here later if needed - not needed but for scalabilty
  return loginAction(cardType, pin);
};

export const deposit = async (userId: string, accountId: string, amount: number): Promise<DepositResponse> => {
  return depositAction(userId, accountId, amount);
};

export const withdraw = async (userId: string, accountId: string, amount: number): Promise<WithdrawResponse> => {
  return withdrawAction(userId, accountId, amount);
};

export const transfer = async (
  userId: string,
  request: TransferRequest
): Promise<TransferResponse> => {
  return transferAction(userId, request);
};
