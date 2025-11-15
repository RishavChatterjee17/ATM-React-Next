import { cookies } from "next/headers";

// storing the user id in a cookie for persistency on client side
export async function setUserId(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set("userId", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const userId = cookieStore?.get("userId");
  return userId?.value || null;
}

export async function clearUserId() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
}
