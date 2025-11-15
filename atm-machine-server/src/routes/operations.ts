// operations routes -> deposit, withdraw, transfer, get transactions

import { Router } from 'express';
import {
  depositRequestSchema,
  withdrawRequestSchema,
  transferRequestSchema,
} from '../schema/operations.js';
import { findUserById, findAccountById, updateAccountBalance, addTransaction, getTransactionsByUserId } from '../utils/helper.js';

const router = Router();

router.post('/deposit', (req, res) => {
  try {
    // added a custom header to simulate token authentication
    const userId = req.headers['x-user-id'] as string || req.query.userId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // runtime zod validation check
    const validatedData = depositRequestSchema.parse(req.body);

    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const account = findAccountById(userId, validatedData.accountId);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    const newBalance = account.balance + validatedData.amount;
    updateAccountBalance(userId, validatedData.accountId, newBalance);

    const transaction = {
      id: `tx-${Date.now()}`,
      userId,
      type: 'Deposit' as const,
      amount: validatedData.amount,
      accountId: validatedData.accountId,
      description: `Deposit to ${account.type}`,
      date: new Date().toISOString(),
      balanceAfter: newBalance,
    };

    addTransaction(transaction);

    res.json({
      success: true,
      message: 'Deposit successful',
      transaction,
      newBalance,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.post('/withdraw', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || req.query.userId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const validatedData = withdrawRequestSchema.parse(req.body);

    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const account = findAccountById(userId, validatedData.accountId);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    if (account.balance < validatedData.amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance',
        currentBalance: account.balance,
      });
    }

    const newBalance = account.balance - validatedData.amount;
    updateAccountBalance(userId, validatedData.accountId, newBalance);

    const transaction = {
      id: `tx-${Date.now()}`,
      userId,
      type: 'Withdrawal' as const,
      amount: validatedData.amount,
      accountId: validatedData.accountId,
      description: `Withdrawal from ${account.type}`,
      date: new Date().toISOString(),
      balanceAfter: newBalance,
    };

    addTransaction(transaction);

    res.json({
      success: true,
      message: 'Withdrawal successful',
      transaction,
      newBalance,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.post('/transfer', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || req.query.userId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const validatedData = transferRequestSchema.parse(req.body);

    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const fromAccount = findAccountById(userId, validatedData.fromAccountId);
    if (!fromAccount) {
      return res.status(404).json({
        success: false,
        message: 'From account not found',
      });
    }

    if (fromAccount.balance < validatedData.amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance',
        currentBalance: fromAccount.balance,
      });
    }

    if (validatedData.isSelfTransfer) {
      if (!validatedData.toAccountId) {
        return res.status(400).json({
          success: false,
          message: 'To account ID is required for self transfer',
        });
      }

      const toAccount = findAccountById(userId, validatedData.toAccountId);
      if (!toAccount) {
        return res.status(404).json({
          success: false,
          message: 'To account not found',
        });
      }

      if (fromAccount.id === toAccount.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot transfer to the same account',
        });
      }

      const fromNewBalance = fromAccount.balance - validatedData.amount;
      const toNewBalance = toAccount.balance + validatedData.amount;

      // source
      updateAccountBalance(userId, validatedData.fromAccountId, fromNewBalance);
      // destination
      updateAccountBalance(userId, validatedData.toAccountId, toNewBalance);

      const transaction = {
        id: `tx-${Date.now()}`,
        userId,
        type: 'Transfer' as const,
        amount: validatedData.amount,
        fromAccountId: validatedData.fromAccountId,
        toAccountId: validatedData.toAccountId,
        description: `Transfer from ${fromAccount.type} to ${toAccount.type}`,
        date: new Date().toISOString(),
        balanceAfter: fromNewBalance,
      };

      addTransaction(transaction);

      res.json({
        success: true,
        message: 'Transfer successful',
        transaction,
        fromAccountBalance: fromNewBalance,
        toAccountBalance: toNewBalance,
      });
    } else {
      if (!validatedData.recipientEmail) {
        return res.status(400).json({
          success: false,
          message: 'Recipient email is required for transfer to others',
        });
      }

      const fromNewBalance = fromAccount.balance - validatedData.amount;
      updateAccountBalance(userId, validatedData.fromAccountId, fromNewBalance);

      const transaction = {
        id: `tx-${Date.now()}`,
        userId,
        type: 'Transfer' as const,
        amount: validatedData.amount,
        fromAccountId: validatedData.fromAccountId,
        recipientEmail: validatedData.recipientEmail,
        description: `Transfer to ${validatedData.recipientEmail}`,
        date: new Date().toISOString(),
        balanceAfter: fromNewBalance,
      };

      addTransaction(transaction);

      res.json({
        success: true,
        message: 'Transfer successful',
        transaction,
        fromAccountBalance: fromNewBalance,
      });
    }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.get('/', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || req.query.userId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userTransactions = getTransactionsByUserId(userId);

    res.json({
      success: true,
      transactions: userTransactions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;

