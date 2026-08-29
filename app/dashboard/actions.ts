"use server";

import { revalidatePath } from "next/cache";

import { updateUserLocale } from "@/lib/users/updateUserLocale";

export async function updateAccountLocale(locale: string) {
  const result = await updateUserLocale(locale);

  if (result.ok) {
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard", "layout");
  }

  return result;
}
