"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type z } from "zod";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { createUserSchema } from "~/validators/user.validators";

type FormState = {
  success: boolean;
  message: string;
};

export async function createUser(
  data: z.infer<typeof createUserSchema>,
): Promise<FormState> {
  const parsedData = createUserSchema.safeParse(data);

  if (!parsedData.success) return { success: false, message: "Invalid data" };

  try {
    await db.insert(users).values({ ...parsedData.data, password: "" });
    revalidatePath("/dashboard/users");
  } catch (error) {
    const castedError = error as Error;
    return {
      success: false,
      message: castedError.message ?? "An error occurred",
    };
  }

  return { success: true, message: "User created" };
}

export async function deleteUser(userId: number): Promise<FormState> {
  try {
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/dashboard/users");
    return { success: true, message: "User deleted" };
  } catch (error) {
    const castedError = error as Error;
    return {
      success: false,
      message: castedError.message ?? "An error occurred",
    };
  }
}
