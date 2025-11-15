// mock data for the atm machine

import type { User, Account, Card } from '../schema/user.js';
import type { Transaction } from '../schema/operations.js';

export const users: User[] = [
  {
    id: '1',
    username: 'rishav',
    email: 'rishav@gmail.com',
    firstname: 'Rishav',
    lastname: 'Chatterjee',
    pin: '5555',
    accounts: [
      {
        id: 'acc-1',
        type: 'Chequing',
        balance: 5000,
        accountNumber: '****5555',
      },
      {
        id: 'acc-2',
        type: 'Savings',
        balance: 12500,
        accountNumber: '****5678',
      },
      {
        id: 'acc-3',
        type: 'GIC',
        balance: 25000,
        accountNumber: '****9012',
      },
    ],
    cards: [
      {
        id: 'card-1',
        type: 'Visa',
        number: '****4532',
        expiry: '12/26',
      },
      {
        id: 'card-2',
        type: 'Mastercard',
        number: '****8901',
        expiry: '03/27',
      },
    ],
    contact: 1234567890,
    address: '123 Main St',
    accountID: 'acc-1',
    accountStatus: 'active' as const,
    verfied: true,
  },
  {
    id: '2',
    username: 'todd',
    email: 'Todd@yahoo.com',
    firstname: 'Todd',
    lastname: 'H',
    pin: '1234',
    accounts: [
      {
        id: 'acc-1',
        type: 'Chequing',
        balance: 7500,
        accountNumber: '****1234',
      },
      {
        id: 'acc-2',
        type: 'Savings',
        balance: 22350,
        accountNumber: '****4125',
      },
    ],
    cards: [
      {
        id: 'card-1',
        type: 'Visa',
        number: '****4532',
        expiry: '09/27',
      },
    ],
    contact: 9876543210,
    address: '456 Oak Ave',
    accountID: 'acc-1',
    accountStatus: 'active' as const,
    verfied: false,
  },
];

export const transactions: Transaction[] = [
  {
    id: 'tx-1',
    userId: '1',
    type: 'Deposit',
    amount: 500,
    accountId: 'acc-1',
    description: 'Cash deposit',
    date: '2024-11-10',
    balanceAfter: 5000,
  },
  {
    id: 'tx-2',
    userId: '1',
    type: 'Withdrawal',
    amount: 200,
    accountId: 'acc-1',
    description: 'ATM withdrawal',
    date: '2024-11-09',
    balanceAfter: 5000,
  },
  {
    id: 'tx-3',
    userId: '1',
    type: 'Transfer',
    amount: 150,
    fromAccountId: 'acc-1',
    toAccountId: 'acc-2',
    description: 'Transfer to Savings',
    date: '2024-11-08',
    balanceAfter: 5000,
  },
  {
    id: 'tx-4',
    userId: '2',
    type: 'Withdrawal',
    amount: 5000,
    accountId: 'acc-1',
    description: 'ATM withdrawal',
    date: '2024-08-12',
    balanceAfter: 5000,
  },
  {
    id: 'tx-5',
    userId: '2',
    type: 'Transfer',
    amount: 350,
    fromAccountId: 'acc-2',
    toAccountId: 'acc-1',
    description: 'Transfer to Chequing',
    date: '2025-11-06',
    balanceAfter: 5000,
  },
];



