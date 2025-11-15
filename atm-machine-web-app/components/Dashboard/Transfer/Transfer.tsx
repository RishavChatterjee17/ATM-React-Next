"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePageTransition } from "@/hooks/usePageTransition";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { transfer } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, CircleX, Loader2 } from "lucide-react";
import type { User } from "@/lib/schemas/types";
import styles from "./Transfer.module.css";
import { useAppDispatch } from "@/hooks/hooks";
import { setUserId, setDisplayName, setUsername } from "@/lib/features/appSlice";

interface TransferPageProps {
  userId: string;
  user: User;
}

export default function TransferPage({ userId, user }: TransferPageProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { navigateTo } = usePageTransition();
  const [amount, setAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSelfTransfer, setIsSelfTransfer] = useState(false);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
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

  const handleTransfer = async () => {
    if (!fromAccountId) {
      setErrorMessage("Please select a from account");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setErrorMessage("Please enter a valid amount");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (isSelfTransfer) {
      if (!toAccountId) {
        setErrorMessage("Please select a to account");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }
      if (fromAccountId === toAccountId) {
        setErrorMessage("Cannot transfer to the same account");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }
    } else {
      if (!recipientEmail) {
        setErrorMessage("Please enter recipient email");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipientEmail)) {
        setErrorMessage("Please enter a valid email address");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }
    }

    // Check if from account has sufficient balance
    const fromAccount = accounts.find((acc) => acc.id === fromAccountId);
    if (fromAccount && fromAccount.balance < transferAmount) {
      setErrorMessage(`Insufficient balance. Available: $${fromAccount.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsLoading(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      const response = await transfer(userId, {
        fromAccountId,
        toAccountId: isSelfTransfer ? toAccountId : undefined,
        recipientEmail: !isSelfTransfer ? recipientEmail : undefined,
        amount: transferAmount,
        isSelfTransfer,
      });
      
      if (response.success) {
        setShowSuccess(true);
        setAmount("");
        setRecipientEmail("");
        setFromAccountId("");
        setToAccountId("");
        setTimeout(() => {
          setShowSuccess(false);
          router.refresh();
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Transfer failed. Please try again.";
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
              <AlertTitle className={styles.successTitle}>Transfer Successful!</AlertTitle>
              <AlertDescription className={styles.successDescription}>
                Your transfer has been processed successfully.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {showError && (
          <div className={styles.alertContainer}>
            <Alert className={styles.errorAlert}>
              <CircleX className={styles.errorIcon} />
              <AlertTitle className={styles.errorTitle}>Transfer Failed</AlertTitle>
              <AlertDescription className={styles.errorDescription}>{errorMessage}</AlertDescription>
            </Alert>
          </div>
        )}

        <Card className={styles.card}>
          <CardHeader>
            <CardTitle className={styles.cardTitle}>Transfer Money</CardTitle>
            <CardDescription className={styles.cardDescription}>
              Send money to another person or between your own accounts
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className={styles.toggleContainer}>
              <Label htmlFor="self-transfer" className={styles.toggleLabel}>
                Transfer Type: {isSelfTransfer ? "Self" : "Others"}
              </Label>
              <Switch
                id="self-transfer"
                checked={isSelfTransfer}
                onCheckedChange={setIsSelfTransfer}
                disabled={isLoading}
              />
            </div>

            <div className={styles.formContainer}>
              <div className={styles.fieldContainer}>
                <label className={styles.label}>From</label>
                <Select value={fromAccountId} onValueChange={setFromAccountId} disabled={isLoading}>
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

              {isSelfTransfer ? (
                <div className={styles.fieldContainer}>
                  <label className={styles.label}>To</label>
                  <Select value={toAccountId} onValueChange={setToAccountId} disabled={isLoading}>
                    <SelectTrigger className={styles.selectTrigger}>
                      <SelectValue placeholder="Choose account" />
                    </SelectTrigger>
                    <SelectContent className={styles.selectContent}>
                      {accounts
                        .filter((account) => account.id !== fromAccountId)
                        .map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.type} - {account.accountNumber} (Balance: ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className={styles.fieldContainer}>
                  <label className={styles.label}>
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter recipient email"
                    className={styles.input}
                    disabled={isLoading}
                  />
                  <Label className={styles.helperText}>
                    For Recipient Transfers, only chequing account can be used to send money.
                  </Label>
                </div>
              )}

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

              <Button
                className={styles.submitButton}
                onClick={handleTransfer}
                disabled={
                  isLoading ||
                  !fromAccountId ||
                  !amount ||
                  (isSelfTransfer ? !toAccountId : !recipientEmail)
                }
              >
                {isLoading ? (
                  <div className={styles.loaderContainer}>
                    <Loader2 className={styles.loaderIcon} />
                    Processing...
                  </div>
                ) : (
                  "Confirm Transfer"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
