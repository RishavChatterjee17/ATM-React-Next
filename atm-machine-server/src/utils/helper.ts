// added some helper functions, currently using it for defining the routes under /routes folder

import { users, transactions } from "../data/store.js";
import type { Transaction } from "../schema/operations.js";
import type { User, Account } from "../schema/user.js";

export const findUserById = (id: string): User | undefined => {
    return users.find((user) => user.id === id);
  };
  
  export const findAccountById = (userId: string, accountId: string): Account | undefined => {
    const user = findUserById(userId);
    return user?.accounts.find((acc) => acc.id === accountId);
  };
  
  export const updateAccountBalance = (
    userId: string,
    accountId: string,
    newBalance: number
  ): boolean => {
    const user = findUserById(userId);
    const account = user?.accounts.find((acc) => acc.id === accountId);
    if (account) {
      account.balance = newBalance;
      return true;
    }
    return false;
  };
  
  export const addTransaction = (transaction: Transaction): void => {
    transactions.unshift(transaction);
  };
  
  export const getTransactionsByUserId = (userId: string): Transaction[] => {
    return transactions.filter((tx) => tx.userId === userId);
  };

  export const updateUserProfile = (
    userId: string,
    updates: {
      firstname?: string;
      lastname?: string;
      email?: string;
      contact?: number;
      address?: string;
    }
  ): boolean => {
    const user = findUserById(userId);
    if (user) {
      if (updates.firstname !== undefined) user.firstname = updates.firstname;
      if (updates.lastname !== undefined) user.lastname = updates.lastname;
      if (updates.email !== undefined) user.email = updates.email;
      if (updates.contact !== undefined) user.contact = updates.contact;
      if (updates.address !== undefined) user.address = updates.address;
      return true;
    }
    return false;
  };