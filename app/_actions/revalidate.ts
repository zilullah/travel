"use server";

import { revalidatePath } from "next/cache";

export async function revalidateLandingPages() {
  try {
    revalidatePath("/");
    revalidatePath("/rentals");
    revalidatePath("/packages");
    revalidatePath("/properties");
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Failed to revalidate pages cache:", error);
    return { success: false, error: String(error) };
  }
}
