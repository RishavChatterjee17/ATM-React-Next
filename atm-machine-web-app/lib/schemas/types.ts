import { z } from 'zod';

export const HealthCheckResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
});

export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

export const AccountSchema = z.object({
  id: z.string(),
  type: z.enum(['Chequing', 'Savings', 'GIC']),
  balance: z.number(),
  accountNumber: z.string(),
});

export type Account = z.infer<typeof AccountSchema>;

export const CardSchema = z.object({
  id: z.string(),
  type: z.enum(['Visa', 'Mastercard']),
  number: z.string(),
  expiry: z.string(),
});

export type Card = z.infer<typeof CardSchema>;

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  accounts: z.array(AccountSchema),
  cards: z.array(CardSchema),
  contact: z.number(),
  address: z.string(),
  accountID: z.string(),
  accountStatus: z.enum(['active', 'inactive', 'disabled']),
  verfied: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;

export const LoginRequestSchema = z.object({
  cardType: z.enum(['visa', 'mastercard']),
  pin: z.string(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: UserSchema.optional(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['Deposit', 'Withdrawal', 'Transfer']),
  amount: z.number(),
  accountId: z.string().optional(),
  fromAccountId: z.string().optional(),
  toAccountId: z.string().optional(),
  recipientEmail: z.string().optional(),
  description: z.string(),
  date: z.string(),
  balanceAfter: z.number(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const DepositRequestSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  amount: z.number().positive('Amount must be positive'),
});

export type DepositRequest = z.infer<typeof DepositRequestSchema>;

export const DepositResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  transaction: TransactionSchema,
  newBalance: z.number(),
});

export type DepositResponse = z.infer<typeof DepositResponseSchema>;

export const WithdrawRequestSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  amount: z.number().positive('Amount must be positive'),
});

export type WithdrawRequest = z.infer<typeof WithdrawRequestSchema>;

export const WithdrawResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  transaction: TransactionSchema,
  newBalance: z.number(),
});

export type WithdrawResponse = z.infer<typeof WithdrawResponseSchema>;

export const TransferRequestSchema = z.object({
  fromAccountId: z.string().min(1, 'From account ID is required'),
  toAccountId: z.string().optional(),
  recipientEmail: z.email().optional(),
  amount: z.number().positive('Amount must be positive'),
  isSelfTransfer: z.boolean(),
});

export type TransferRequest = z.infer<typeof TransferRequestSchema>;

export const TransferResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  transaction: TransactionSchema,
  fromAccountBalance: z.number(),
  toAccountBalance: z.number().optional(),
});

export type TransferResponse = z.infer<typeof TransferResponseSchema>;

export const TransactionsResponseSchema = z.object({
  success: z.boolean(),
  transactions: z.array(TransactionSchema),
});

export type TransactionsResponse = z.infer<typeof TransactionsResponseSchema>;

