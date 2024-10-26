"use server";

import { type z } from "zod";
import { type Response } from "../types";
import { createProductSchema } from "~/validators/product.validators";
import { catchAcync } from "~/lib/utils";
import { db } from "../db";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { validateRequest } from "~/lib/validateRequest";

export async function createProduct(
  data: z.infer<typeof createProductSchema>,
): Promise<Response> {
  // only admins can create products
  const { user } = await validateRequest();
  if (!["superadmin", "admin"].includes(user?.role ?? ""))
    return { success: false, message: "Unauthorized" };

  const parsedData = createProductSchema.safeParse(data);
  if (!parsedData.success) return { success: false, message: "Invalid data" };

  return catchAcync(async () => {
    const { package_price, unit_price, ...rest } = parsedData.data;

    const id = randomUUID();
    const priceId = randomUUID();

    await db.$transaction(async (tx) => {
      const product = await tx.smd_Product.create({ data: { id, ...rest } });
      return await tx.smd_ProductPrice.create({
        data: {
          id: priceId,
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
