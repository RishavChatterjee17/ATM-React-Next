"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/hooks/hooks";
import { usePageTransition } from "@/hooks/usePageTransition";

export function useCardTypeValidation() {
  const { navigateTo } = usePageTransition();
  const cardType = useAppSelector((state) => state.app.randomlyChosenCard);

  useEffect(() => {
    if (!cardType || (cardType !== "visa" && cardType !== "mastercard")) {
      navigateTo("/");
    }
  }, [cardType, navigateTo]);

  return cardType;
}
