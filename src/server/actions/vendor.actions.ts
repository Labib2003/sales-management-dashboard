"use server";

import { type z } from "zod";
import { validateRequest } from "~/lib/validateRequest";
import {
  createVendorSchema,
  type updateVendorSchema,
} from "~/validators/vendor.validators";
import { type Response } from "../types";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { catchAcync } from "~/lib/utils";
import { type smd_Role } from "@prisma/client";

export async function createVendor(
  data: z.infer<typeof createVendorSchema>,
): Promise<Response> {
  // only admins and managers can create vendors
  const { user } = await validateRequest();
  if (!(["superadmin", "admin"] as smd_Role[]).includes(user?.role ?? "guest"))
    return { success: false, message: "Unauthorized" };
  if (user?.role === "demo")
    return { success: false, message: "Mutations are disabled for demo user" };

  const parsedData = createVendorSchema.safeParse(data);
  if (!parsedData.success) return { success: false, message: "Invalid data" };

  return catchAcync(async () => {
    await db.smd_Vendor.create({ data: { ...parsedData.data } });
    revalidatePath("/dashboard/vendors");
    return { success: true, message: "Vendor created successfully" };
  });
}

export async function deleteVendor(id: string): Promise<Response> {
  // only admins can delete vendors
  const { user } = await validateRequest();
  if (!(["superadmin", "admin"] as smd_Role[]).includes(user?.role ?? "guest"))
    return { success: false, message: "Unauthorized" };
  if (user?.role === "demo")
    return { success: false, message: "Mutations are disabled for demo user" };

  return catchAcync(async () => {
    await db.smd_Vendor.update({ where: { id }, data: { active: false } });
    revalidatePath("/dashboard/vendors");
    return { success: true, message: "Vendor deleted successfully" };
  });
}

export async function updateVendor(
  id: string,
  data: z.infer<typeof updateVendorSchema>,
): Promise<Response> {
  // only admins can update vendors
  const { user } = await validateRequest();
  if (!(["superadmin", "admin"] as smd_Role[]).includes(user?.role ?? "guest"))
    return { success: false, message: "Unauthorized" };
  if (user?.role === "demo")
    return { success: false, message: "Mutations are disabled for demo user" };

  const parsedData = createVendorSchema.safeParse(data);
  if (!parsedData.success) return { success: false, message: "Invalid data" };

  return catchAcync(async () => {
    await db.smd_Vendor.update({ where: { id }, data: parsedData.data });
    revalidatePath("/dashboard/vendors");
    return { success: true, message: "Vendor updated successfully" };
  });
}
