"use server";

import { randomUUID } from "crypto";
import { type z } from "zod";
import { validateRequest } from "~/lib/validateRequest";
import { createVendorSchema } from "~/validators/vendor.validators";
import { type Response } from "../types";
import { db } from "../db";
import { revalidatePath } from "next/cache";

export async function createVendor(
  data: z.infer<typeof createVendorSchema>,
): Promise<Response> {
  // only admins can create vendors
  const { user } = await validateRequest();
  if (!["superadmin", "admin"].includes(user?.role ?? ""))
    return { success: false, message: "Unauthorized" };

  const parsedData = createVendorSchema.safeParse(data);
  if (!parsedData.success) return { success: false, message: "Invalid data" };

  const id = randomUUID();

  try {
    await db.smd_Vendor.create({ data: { id, ...parsedData.data } });
    revalidatePath("/dashboard/vendors");
    return { success: true, message: "Vendor created successfully" };
  } catch (error) {
    const castedError = error as Error;
    return {
      success: false,
      message: castedError.message ?? "An error occurred",
    };
  }
}

export async function deleteVendor(id: string): Promise<Response> {
  // only admins can delete vendors
  const { user } = await validateRequest();
  if (!["superadmin", "admin"].includes(user?.role ?? ""))
    return { success: false, message: "Unauthorized" };

  try {
    await db.smd_Vendor.update({ where: { id }, data: { active: false } });
    revalidatePath("/dashboard/vendors");
    return {
      success: true,
      message: "Vendor deleted successfully",
    };
  } catch (error) {
    const castedError = error as Error;
    return {
      success: false,
      message: castedError.message ?? "An error occurred",
    };
  }
}
