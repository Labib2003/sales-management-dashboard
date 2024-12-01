"use server";

import { validateRequest } from "~/lib/validateRequest";
import { createInvoiceSchema } from "~/validators/invoice.validators";
import { type Response } from "../types";
import { catchAcync } from "~/lib/utils";
import { revalidatePath } from "next/cache";
import { type z } from "zod";
import { db } from "../db";
import { type smd_Role } from "@prisma/client";

export async function createInvoice(
  data: z.infer<typeof createInvoiceSchema>,
): Promise<Response> {
  // guests cannot create products
  const { user } = await validateRequest();
  if (
    !(["superadmin", "admin", "manager", "salesman"] as smd_Role[]).includes(
      user?.role ?? "guest",
    )
  )
    return { success: false, message: "Unauthorized" };

  const parsedData = createInvoiceSchema.safeParse(data);
  if (!parsedData.success) return { success: false, message: "Invalid data" };

  return catchAcync(async () => {
    const { items, ...rest } = parsedData.data;

    await db.$transaction(async (tx) => {
      const invoice = await tx.smd_Invoice.create({
        data: { ...rest, created_by_id: user.id },
      });
      await tx.smd_InvoiceItem.createMany({
        data: items.map((itm) => ({ ...itm, invoice_id: invoice.id })),
      });
    });

    revalidatePath("/dashboard/invoices");
    return { success: true, message: "Invoice created successfully" };
  });
}

export async function deleteInvoice(id: string): Promise<Response> {
  // only admins and managers can delete invoices
  const { user } = await validateRequest();
  if (!(["superadmin", "admin"] as smd_Role[]).includes(user?.role ?? "guest"))
    return { success: false, message: "Unauthorized" };

  return catchAcync(async () => {
    await db.smd_Invoice.update({ where: { id }, data: { active: false } });
    revalidatePath("/dashboard/invoices");
    return { success: true, message: "Invoice deleted successfully" };
  });
}
