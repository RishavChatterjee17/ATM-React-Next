import { redirect } from 'next/navigation';
import DepositPage from "@/components/Dashboard/Deposit/Deposit";
import { getUserId } from '@/lib/auth';
import { getServerUserProfile } from '@/lib/server-api';

export default async function Deposit() {
  const userId = await getUserId();
  
  if (!userId) {
    redirect('/');
  }

  let user;
  try {
    const userResponse = await getServerUserProfile(userId);
    if (userResponse.success) {
      user = userResponse.user;
    } else {
      redirect('/');
    }
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    redirect('/');
  }

  if (!user) {
    redirect('/');
  }

  return (
    <div>
      <DepositPage userId={userId} user={user} />
    </div>
  );
}
