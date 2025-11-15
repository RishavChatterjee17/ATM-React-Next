import { z } from 'zod';

export const accountTypeSchema = z.enum(['Chequing', 'Savings', 'GIC']);

export const cardTypeSchema = z.enum(['Visa', 'Mastercard']);

export const accountSchema = z.object({
  id: z.string(),
  type: accountTypeSchema,
  balance: z.number().nonnegative(),
  accountNumber: z.string(),
});

export const cardSchema = z.object({
  id: z.string(),
  type: cardTypeSchema,
  number: z.string(),
  expiry: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.email(),
  firstname: z.string(),
  lastname: z.string(),
  pin: z.string().length(4),
  accounts: z.array(accountSchema),
  cards: z.array(cardSchema),
  contact: z.number(),
  address: z.string(),
  accountID: z.string(),
  accountStatus: z.enum(['active', 'inactive', 'disabled']) ,
  verfied: z.boolean(),
});

export type Account = z.infer<typeof accountSchema>;
export type Card = z.infer<typeof cardSchema>;
export type User = z.infer<typeof userSchema>;