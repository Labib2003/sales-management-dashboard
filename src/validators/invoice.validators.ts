import { z } from "zod";

export const customerInfoSchema = z.object({
  customer_name: z.string().min(1).max(50),
  customer_contact: z.string().min(1).max(50),
  customer_address: z.string().min(1).max(100).optional(),
});

export const createInvoiceSchema = customerInfoSchema.extend({
  items: z.array(
    z.object({
      product_price_id: z.string(),
      package_quantity: z.number().optional(),
      unit_quaintity: z.number().optional(),
    }),
  ),
});
