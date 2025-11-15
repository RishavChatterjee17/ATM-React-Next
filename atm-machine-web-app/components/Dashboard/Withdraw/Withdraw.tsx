"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePageTransition } from "@/hooks/usePageTransition";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { withdraw } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, CircleX, Loader2 } from "lucide-react";
import type { User } from "@/lib/schemas/types";
import styles from "./Withdraw.module.css";
import { useAppDispatch } from "@/hooks/hooks";
import { setUserId, setDisplayName, setUsername } from "@/lib/features/appSlice";

interface WithdrawalPageProps {
  userId: string;
  user: User;
}

export default function WithdrawalPage({ userId, user }: WithdrawalPageProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { navigateTo } = usePageTransition();
  const [amount, setAmount] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const accounts = user.accounts || [];

  useEffect(() => {
    if (user) {
      dispatch(setUserId(user.id));
      dispatch(setDisplayName(user.firstname));
      dispatch(setUsername(user.username));
    }
  }, [user, dispatch]);

  const handleBack = () => {
    navigateTo("/dashboard");
  };

  const handleWithdraw = async () => {
    if (!selectedAccountId) {
      setErrorMessage("Please select an account");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setErrorMessage("Please enter a valid amount");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);
    if (selectedAccount && selectedAccount.balance < withdrawAmount) {
      setErrorMessage(`Insufficient balance. Available: $${selectedAccount.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsLoading(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      const response = await withdraw(userId, selectedAccountId, withdrawAmount);
      
      if (response.success) {
        setShowSuccess(true);
        setAmount("");
        setSelectedAccountId("");
        setTimeout(() => {
          setShowSuccess(false);
          router.refresh();
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Withdrawal failed. Please try again.";
      setErrorMessage(errorMsg);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Button variant="outline" onClick={handleBack} className={styles.backButton}>
          ← Back to Dashboard
        </Button>

        {showSuccess && (
          <div className={styles.alertContainer}>
            <Alert className={styles.successAlert}>
              <CheckCircle2Icon className={styles.successIcon} />
              <AlertTitle className={styles.successTitle}>Withdrawal Successful!</AlertTitle>
              <AlertDescription className={styles.successDescription}>
                Your withdrawal has been processed successfully. Please collect your cash.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {showError && (
          <div className={styles.alertContainer}>
            <Alert className={styles.errorAlert}>
              <CircleX className={styles.errorIcon} />
              <AlertTitle className={styles.errorTitle}>Withdrawal Failed</AlertTitle>
              <AlertDescription className={styles.errorDescription}>{errorMessage}</AlertDescription>
            </Alert>
          </div>
        )}

        <Card className={styles.card}>
          <CardHeader>
            <CardTitle className={styles.cardTitle}>Withdraw Money</CardTitle>
            <CardDescription className={styles.cardDescription}>
              Take out cash from your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={styles.formContainer}>
              <div className={styles.fieldContainer}>
                <label className={styles.label}>From</label>
                <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                  <SelectTrigger className={styles.selectTrigger}>
                    <SelectValue placeholder="Choose account" />
                  </SelectTrigger>
                  <SelectContent className={styles.selectContent}>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.type} - {account.accountNumber} (Balance: ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={styles.fieldContainer}>
                <label className={styles.label}>Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className={styles.input}
                  disabled={isLoading}
                  min="0.01"
                  step="0.01"
                />
              </div>
              <label className={styles.instructionText}>
                Enter the amount you want to withdraw and collect the cash from the dispenser.
              </label>
              <Button
                className={styles.submitButton}
                onClick={handleWithdraw}
                disabled={isLoading || !selectedAccountId || !amount}
              >
                {isLoading ? (
                  <div className={styles.loaderContainer}>
                    <Loader2 className={styles.loaderIcon} />
                    Processing...
                  </div>
                ) : (
                  "Confirm Withdrawal"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
