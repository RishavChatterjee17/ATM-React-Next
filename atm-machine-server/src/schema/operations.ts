// used zod for schema declaration and validation - since it goes well with TypeScript types

import { z } from 'zod';

export const transactionTypeSchema = z.enum(['Deposit', 'Withdrawal', 'Transfer']);

export const transactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: transactionTypeSchema,
  amount: z.number().positive('Amount must be positive'),
  accountId: z.string().optional(),
  fromAccountId: z.string().optional(),
  toAccountId: z.string().optional(),
  recipientEmail: z.email().optional(),
  description: z.string(),
  date: z.string(),
  balanceAfter: z.number().nonnegative(),
});

export const depositRequestSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  amount: z.number().positive('Amount must be positive'),
});

export const withdrawRequestSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  amount: z.number().positive('Amount must be positive'),
});

export const transferRequestSchema = z.object({
  fromAccountId: z.string().min(1, 'From account ID is required'),
  toAccountId: z.string().optional(),
  recipientEmail: z.email().optional(),
  amount: z.number().positive('Amount must be positive'),
  isSelfTransfer: z.boolean(),
}).refine(
  (data) => {
    return data.isSelfTransfer ? !!data.toAccountId : !!data.recipientEmail;
  },
  {
    message: 'Either toAccountId (for self transfer) or recipientEmail (for transfer to others) must be provided',
  }
);

export type Transaction = z.infer<typeof transactionSchema>;
export type DepositRequest = z.infer<typeof depositRequestSchema>;
export type WithdrawRequest = z.infer<typeof withdrawRequestSchema>;
export type TransferRequest = z.infer<typeof transferRequestSchema>;