import { redirect } from "next/navigation";
import TransactionsPage from "@/components/Dashboard/Transactions/Transactions";
import { getUserId } from "@/lib/auth";
import { getServerTransactions } from "@/lib/server-api";
import { Transaction } from "@/lib/schemas/types";

export default async function Transactions() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/");
  }

  let transactions: Transaction[] = [];
  try {
    const response = await getServerTransactions(userId);
    if (response.success) {
      transactions = response.transactions.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
  }

  return (
    <div>
      <TransactionsPage userId={userId} initialTransactions={transactions} />
    </div>
  );
}
