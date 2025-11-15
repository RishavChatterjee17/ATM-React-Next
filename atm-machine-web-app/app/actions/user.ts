"use server";

import { User } from "@/lib/schemas/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const EXTERNAL_API_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function updateUserProfileAction(updatedData: {
  firstname?: string;
  lastname?: string;
  email?: string;
  contact?: number;
  address?: string;
}): Promise<{ success: boolean; message?: string; user?: User }> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return {
        success: false,
        message: "User ID not found",
      };
    }

    const response = await fetch(`${EXTERNAL_API_URL}/api/user/profile?userId=${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify(updatedData),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || response.statusText || "Failed to update profile";
      return {
        success: false,
        message: errorMessage,
      };
    }

    const data = await response.json();

    // Revalidate the paths to refresh the data
    revalidatePath("/dashboard/account/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: data.message || "Profile updated successfully",
      user: data.user,
    };
  } catch (error) {
    console.error("Update user profile action error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
    return {
      success: false,
      message: errorMessage,
    };
  }
}
