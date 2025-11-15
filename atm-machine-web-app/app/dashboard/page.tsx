import { redirect } from "next/navigation";
import DashboardPage from "@/components/Dashboard/DashboardPage";
import { getUserId } from "@/lib/auth";
import { getServerUserProfile } from "@/lib/server-api";

// Srever Component. Gets and stores the user data in the next server. Passing the user as props to client dashboard page for further use.
// smaller client side bundle + persistent data on the server (in-memory)
export default async function Dashboard() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/");
  }

  let user;
  try {
    const userResponse = await getServerUserProfile(userId);
    if (userResponse.success) {
      user = userResponse.user;
    } else {
      redirect("/");
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    redirect("/");
  }

  if (!user) {
    redirect("/");
  }

  return (
    <div>
      <DashboardPage user={user} />
    </div>
  );
}
