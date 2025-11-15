"use client";

import { Button } from "@/components/ui/button";
import { Flex, Box, Text } from "@radix-ui/themes";
import styles from "./HomePage.module.css";
import { usePageTransition } from "@/hooks/usePageTransition";
import { useAppDispatch } from "@/hooks/hooks";
import { setRandomlyChosenCard } from "@/lib/features/appSlice";
import Image from "next/image";
import { useState, useEffect } from "react";
import { checkHealth } from "@/lib/api";

export default function Home() {
  const dispatch = useAppDispatch();
  const { navigateTo } = usePageTransition();
  const [cardType] = useState<"visa" | "mastercard">(() =>
    Math.random() < 0.5 ? "visa" : "mastercard"
  );
  console.log(cardType);

  // added for connection testing
  useEffect(() => {
    const performHealthCheck = async () => {
      try {
        const response = await checkHealth();
        console.log('Health check successful:', response);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    performHealthCheck();
  }, []);

  const handleLogIn = () => {
    navigateTo("/login");
    dispatch(setRandomlyChosenCard(cardType));
  };

  return (
    <div className={styles.container}>
      <Box className={styles.card}>
        <Flex direction="column" gap="6" align="center">
          <Box className={styles.header}>
            <Text className={styles.title}>ATM</Text>
            <Text className={styles.subtitle}>24/7 ACCESS</Text>
          </Box>

          <Box className={styles.display}>
            <Text className={styles.welcomeText}>Welcome</Text>
            <Text className={styles.instructionText}>Tap or Insert card</Text>
          </Box>

          <Flex direction="column" gap="3" className={styles.buttonContainer}>
            <Button className={styles.signinButton} onClick={handleLogIn}>
              Log In
            </Button>
          </Flex>

          <Box className={styles.footer}>
            <Text className={styles.footerText}>Click Login to continue</Text>
          </Box>
        </Flex>
        <div className={styles.imageContainer}>
          <Image
            src={"/creditcard_sprite.png"}
            alt={"Credit Cards"}
            width={200}
            height={200}
            loading="eager"
          />
        </div>
      </Box>
    </div>
  );
}
