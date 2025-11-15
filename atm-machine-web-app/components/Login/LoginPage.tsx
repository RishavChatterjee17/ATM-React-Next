"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import styles from "./LoginPage.module.css";
import { usePageTransition } from "@/hooks/usePageTransition";
import { CheckCircle2Icon, CircleX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import PaymentCard from "../PaymentCard/PaymentCard";
import { useAppDispatch } from "@/hooks/hooks";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";
import { setUserId, setDisplayName, setUsername } from "@/lib/features/appSlice";
import { useCardTypeValidation } from "@/hooks/useCardTypeValidation";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { navigateTo } = usePageTransition();
  const [pin, setPin] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const maxPinLength = 4;

  const getRandomlyChosenCardType = useCardTypeValidation();

  const handleNumberClick = (num: number) => {
    if (pin.length < maxPinLength) {
      setPin(pin + num);
    }
  };

  const handleClear = () => {
    setPin("");
  };

  const handleEnter = async () => {
    if (pin.length !== maxPinLength) {
      return;
    }

    if (
      !getRandomlyChosenCardType ||
      (getRandomlyChosenCardType !== "visa" && getRandomlyChosenCardType !== "mastercard")
    ) {
      console.error("Invalid card type");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsLoading(true);
    setShowSuccess(false);
    setShowError(false);

    try {
      const response = await login(getRandomlyChosenCardType, pin);

      if (response.success && response.user) {
        dispatch(setUserId(response.user.id));
        dispatch(setDisplayName(response.user.firstname));
        dispatch(setUsername(response.user.username));
        setShowSuccess(true);
        setShowError(false);
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      } else {
        setShowSuccess(false);
        setShowError(true);
        setPin("");
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setShowSuccess(false);
      setShowError(true);
      setPin("");
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigateTo("/");
  };

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className={styles.wrapper}>
      {showSuccess && (
        <div className={styles.alertContainer}>
          <Alert className={styles.alert}>
            <CheckCircle2Icon className={styles.alertIcon} />
            <AlertTitle>Login Successful!</AlertTitle>
            <AlertDescription>Welcome to your account dashboard.</AlertDescription>
          </Alert>
        </div>
      )}
      {showError && (
        <div className={styles.alertContainer}>
          <Alert className={styles.alert}>
            <CircleX className={styles.alertIcon} />
            <AlertTitle>Incorrect Pin</AlertTitle>
            <AlertDescription>Login Unsuccessful. Please try again.</AlertDescription>
          </Alert>
        </div>
      )}
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>ATM</h1>
            <p className={styles.subtitle}>Enter Your PIN</p>
          </div>

          <div className={styles.display}>
            <div className={styles.pinDots}>
              {[...Array(maxPinLength)].map((_, i) => (
                <div
                  key={i}
                  className={`${styles.dot} ${i < pin.length ? styles.dotFilled : ""}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.keypad}>
            {numbers.slice(0, 9).map((num) => (
              <Button
                key={num}
                onClick={() => handleNumberClick(num)}
                className={styles.button}
                variant="outline"
              >
                {num}
              </Button>
            ))}
            <Button
              onClick={handleClear}
              className={`${styles.button} ${styles.clearButton}`}
              variant="outline"
            >
              CLEAR
            </Button>
            <Button
              onClick={() => handleNumberClick(0)}
              className={styles.button}
              variant="outline"
            >
              0
            </Button>
            <Button
              onClick={handleEnter}
              className={`${styles.button} ${styles.enterButton}`}
              variant="outline"
              disabled={pin.length !== maxPinLength || isLoading}
            >
              {isLoading ? "..." : "ENTER"}
            </Button>
          </div>
          {!showSuccess && (
            <Button
              onClick={handleBack}
              className={`${styles.button} ${styles.backButton}`}
              variant="outline"
            >
              BACK
            </Button>
          )}
        </Card>
      </div>

      <div className={styles.paymentCardWrapper}>
        <PaymentCard cardType={getRandomlyChosenCardType} />
      </div>
    </div>
  );
};

export default LoginPage;
