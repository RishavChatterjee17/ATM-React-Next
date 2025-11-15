"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  Send,
  History,
  ChevronRight,
  User as UserIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageTransition } from "@/hooks/usePageTransition";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import type { User, Account, Card as CardType } from "@/lib/schemas/types";
import styles from "./DashboardPage.module.css";
import { useAppDispatch } from "@/hooks/hooks";
import { setUserId, setDisplayName, setUsername, clearUserData } from "@/lib/features/appSlice";

interface DashboardPageProps {
  user: User;
}

export default function DashboardPage({ user }: DashboardPageProps) {
  const dispatch = useAppDispatch();
  const currentPath = usePathname();
  const { navigateTo } = usePageTransition();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const isOnDashboardRef = useRef(currentPath === "/dashboard");

  useEffect(() => {
    if (user) {
      dispatch(setUserId(user.id));
      dispatch(setDisplayName(user.firstname));
      dispatch(setUsername(user.username));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (currentPage === "deposit") navigateTo("/dashboard/deposit");
    if (currentPage === "withdraw") navigateTo("/dashboard/withdraw");
    if (currentPage === "transfer") navigateTo("/dashboard/transfer");
    if (currentPage === "transactions") navigateTo("/dashboard/transactions");
  }, [currentPage, navigateTo]);


  useEffect(() => {
    isOnDashboardRef.current = currentPath === "/dashboard";
  }, [currentPath]);

  useEffect(() => {
    if (currentPath !== "/dashboard") return;

    const handlePopState = (e: PopStateEvent) => {
      if (isOnDashboardRef.current) {
        e.stopImmediatePropagation();
        setLogoutDialogOpen(true);
        window.history.pushState({}, "", "/dashboard");
      }
    };

    window.history.pushState({}, "", "/dashboard");
    window.addEventListener("popstate", handlePopState, true);

    return () => {
      window.removeEventListener("popstate", handlePopState, true);
    };
  }, [currentPath]);

  const accounts = user.accounts || [];
  const cards = user.cards || [];
  const userName = user.firstname || "User";

  const handleLogout = async () => {
    setLogoutDialogOpen(false);
    dispatch(clearUserData());
    await logoutAction();
  };

  if (currentPage === "dashboard") {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.headerTitle}>Account Dashboard</h1>
              <p className={styles.headerDescription}>
                Check out the operations section below to manage your accounts and transactions
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className={styles.userMenu}>
                  <div className={styles.userMenuText}>
                    <p className={styles.userName}>{userName}</p>
                    <p className={styles.userRole}>Account Holder</p>
                  </div>
                  <div className={styles.userAvatar}>
                    <UserIcon className={styles.userAvatarIcon} />
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className={styles.dropdownContent}
              >
                <DropdownMenuLabel className={styles.dropdownLabel}>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className={styles.dropdownSeparator} />
                <DropdownMenuItem
                  className={styles.dropdownItem}
                  onClick={() => navigateTo("/dashboard/account/profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={styles.dropdownItem}
                  onClick={() => setLogoutDialogOpen(true)}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Accounts</h2>
            {accounts.length > 0 ? (
              <div className={styles.accountsGrid}>
                {accounts.map((account: Account) => (
                  <Card key={account.id} className={styles.accountCard}>
                    <CardHeader>
                      <CardTitle className={styles.accountCardTitle}>{account.type}</CardTitle>
                      <CardDescription className={styles.accountCardDescription}>
                        {account.accountNumber}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className={styles.accountBalance}>
                        ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>No accounts found</p>
            )}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Cards</h2>
            {cards.length > 0 ? (
              <div className={styles.cardsGrid}>
                {cards.map((card: CardType) => (
                  <Card key={card.id} className={styles.cardCard}>
                    <CardHeader>
                      <div className={styles.cardCardHeader}>
                        <CardTitle className={styles.cardCardTitle}>{card.type}</CardTitle>
                        <CreditCard className={styles.cardIcon} />
                      </div>
                      <CardDescription className={styles.cardCardDescription}>{card.number}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className={styles.cardExpiry}>Expires: {card.expiry}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>No cards found</p>
            )}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Operations</h2>
            <div className={styles.operationsGrid}>
              {[
                {
                  label: "Deposit",
                  icon: <ArrowDownCircle className="h-8 w-8 text-white" />,
                  desc: "Add money to your account",
                  action: "deposit",
                },
                {
                  label: "Withdraw",
                  icon: <ArrowUpCircle className="h-8 w-8 text-white" />,
                  desc: "Take out cash",
                  action: "withdraw",
                },
                {
                  label: "Transfer",
                  icon: <Send className="h-8 w-8 text-white" />,
                  desc: "Transfer b/w accounts or send money to others",
                  action: "transfer",
                },
                {
                  label: "History",
                  icon: <History className="h-8 w-8 text-white" />,
                  desc: "View transactions",
                  action: "transactions",
                },
              ].map((op, idx) => (
                <Card
                  key={idx}
                  className={styles.operationCard}
                  onClick={() => setCurrentPage(op.action)}
                >
                  <CardContent className={styles.operationContent}>
                    <div className={styles.operationInner}>
                      <div className={styles.operationIcon}>
                        {op.icon}
                      </div>
                      <h3 className={styles.operationLabel}>{op.label}</h3>
                      <p className={styles.operationDescription}>{op.desc}</p>
                      <ChevronRight className={styles.operationChevron} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <DialogContent className={styles.dialogContent}>
            <DialogHeader>
              <DialogTitle className={styles.dialogTitle}>Confirm Logout</DialogTitle>
              <DialogDescription className={styles.dialogDescription}>
                Are you sure you want to log out of your account?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className={styles.dialogFooter}>
              <Button
                variant="outline"
                className={styles.dialogCancelButton}
                onClick={() => setLogoutDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button className={styles.dialogLogoutButton} onClick={handleLogout}>
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
