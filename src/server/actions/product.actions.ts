"use server";

import { type z } from "zod";
import { type Response } from "../types";
import { productValidationSchema } from "~/validators/product.validators";
import { catchAcync } from "~/lib/utils";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { validateRequest } from "~/lib/validateRequest";
import { type smd_Role } from "@prisma/client";

export async function createProduct(
  data: z.infer<typeof productValidationSchema>,
): Promise<Response> {
  // only admins and managers can create products
  const { user } = await validateRequest();
  if (
    !(["superadmin", "admin", "manager"] as smd_Role[]).includes(
      user?.role ?? "guest",
    )
  )
    return { success: false, message: "Unauthorized" };

  const parsedData = productValidationSchema.safeParse(data);
  if (!parsedData.success) return { success: false, message: "Invalid data" };

  return catchAcync(async () => {
    const { package_price, unit_price, ...rest } = parsedData.data;

    await db.$transaction(async (tx) => {
      const product = await tx.smd_Product.create({ data: { ...rest } });
      return await tx.smd_ProductPrice.create({
        data: {
          product_id: product.id,
          package_price,
          unit_price,
        },
      });
    });

    revalidatePath("/dashboard/products");
    return { success: true, message: "Product created successfully" };
  });
}

export async function deleteProduct(id: string): Promise<Response> {
  // only admins and managers can delete products
  const { user } = await validateRequest();
  if (!(["superadmin", "admin"] as smd_Role[]).includes(user?.role ?? "guest"))
    return { success: false, message: "Unauthorized" };

  return catchAcync(async () => {
    await db.smd_Product.update({ where: { id }, data: { active: false } });
    revalidatePath("/dashboard/products");
    return { success: true, message: "Product deleted successfully" };
  });
}

export async function updateProduct(
  id: string,
  data: z.infer<typeof productValidationSchema>,
): Promise<Response> {
  // only admins and managers can update products
  const { user } = await validateRequest();
  if (!(["superadmin", "admin"] as smd_Role[]).includes(user?.role ?? "guest"))
    return { success: false, message: "Unauthorized" };

  const parsedData = productValidationSchema.safeParse(data);
  if (!parsedData.success) return { success: false, message: "Invalid data" };
  const { package_price, unit_price, ...rest } = parsedData.data;

  return catchAcync(async () => {
    await db.$transaction(async (tx) => {
      await tx.smd_Product.update({ where: { id }, data: rest });
      await tx.smd_ProductPrice.create({
        data: { product_id: id, package_price, unit_price },
      });
    });
    revalidatePath("/dashboard/products");
    return { success: true, message: "Product updated successfully" };
  });
}
