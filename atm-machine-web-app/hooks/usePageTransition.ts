"use client";
import { useContext } from "react";
import { TransitionContext } from "../helpers/Transition/PageTransition";

export const usePageTransition = () => {
  const context = useContext(TransitionContext);
  
  if (!context) {
    throw new Error("usePageTransition must be used within PageTransition provider");
  }
  
  return context;
};