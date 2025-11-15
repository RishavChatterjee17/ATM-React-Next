"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePageTransition } from "@/hooks/usePageTransition";
import { ArrowDownCircle, ArrowUpCircle, Send } from "lucide-react";
import type { Transaction } from "@/lib/schemas/types";
import styles from "./Transactions.module.css";

interface TransactionsPageProps {
  userId: string;
  initialTransactions: Transaction[];
}

export default function TransactionsPage({ initialTransactions }: TransactionsPageProps) {
  const { navigateTo } = usePageTransition();
  const [transactions] = useState<Transaction[]>(initialTransactions);

  const handleBack = () => {
    navigateTo("/dashboard");
  };

  const getTransactionType = (type: string) => {
    switch (type.toLowerCase()) {
      case "deposit":
        return "deposit";
      case "withdrawal":
        return "withdrawal";
      case "transfer":
        return "transfer";
      default:
        return "deposit";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${monthNames[month]} ${day}, ${year}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Button variant="outline" onClick={handleBack} className={styles.backButton}>
          ← Back to Dashboard
        </Button>

        <Card className={styles.card}>
          <CardHeader>
            <CardTitle className={styles.cardTitle}>Transaction History</CardTitle>
            <CardDescription className={styles.cardDescription}>
              View your recent transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className={styles.emptyContainer}>
                <p className={styles.emptyText}>No transactions found.</p>
              </div>
            ) : (
              <div className={styles.transactionsList}>
                {transactions.map((tx) => {
                  const transactionType = getTransactionType(tx.type);
                  const isDeposit = transactionType === "deposit";
                  const isWithdrawal = transactionType === "withdrawal";
                  const isTransfer = transactionType === "transfer";

                  return (
                    <div key={tx.id} className={styles.transactionItem}>
                      <div className={styles.transactionLeft}>
                        {isDeposit && (
                          <ArrowDownCircle
                            className={`${styles.transactionIcon} ${styles.depositIcon}`}
                          />
                        )}
                        {isWithdrawal && (
                          <ArrowUpCircle
                            className={`${styles.transactionIcon} ${styles.withdrawalIcon}`}
                          />
                        )}
                        {isTransfer && (
                          <Send className={`${styles.transactionIcon} ${styles.transferIcon}`} />
                        )}
                        <div className={styles.transactionInfo}>
                          <p className={styles.transactionDescription}>{tx.description}</p>
                          <p className={styles.transactionDate}>{formatDate(tx.date)}</p>
                          {tx.accountId && (
                            <p className={styles.transactionAccount}>Account: {tx.accountId}</p>
                          )}
                        </div>
                      </div>
                      <div className={styles.transactionRight}>
                        <p
                          className={`${styles.transactionAmount} ${
                            isDeposit ? styles.depositAmount : styles.withdrawalAmount
                          }`}
                        >
                          {isDeposit ? "+" : "-"}${tx.amount.toFixed(2)}
                        </p>
                        <p className={styles.transactionBalance}>
                          Balance: ${tx.balanceAfter.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
