import LoginPage from "@/components/Login/LoginPage";

// login api call handled by login srever actions in /app/actions/auth.ts
// did not use server side api calling here to show how we canm use a hybrid approach.
export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black text-white font-sans">
      <LoginPage />
    </div>
  );
}
