import { z } from "zod";

export const productValidationSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Product description is required"),
    package: z.string().min(1, "Package type is required"),
    unit: z.string().optional(),
    vendor_id: z.string().min(1, "Vendor is required"),
    package_price: z.coerce
      .number()
      .min(1, "Package price cannot be 0 or negative"),
    unit_price: z.coerce
      .number()
      .min(1, "Unit price cannot be 0 or negative")
      .optional(),
  })
  .refine(
    (values) => {
      return (
        (!!values.unit && !!values.unit_price) ||
        (!values.unit && !values.unit_price)
      );
    },
    {
      message: "Both unit and unit price are required",
      path: ["unit"],
    },
  )
  .refine(
    (values) => {
      return (
        (!!values.unit && !!values.unit_price) ||
        (!values.unit && !values.unit_price)
      );
    },
    {
      message: "Both unit and unit price are required",
      path: ["unit_price"],
    },
  );
