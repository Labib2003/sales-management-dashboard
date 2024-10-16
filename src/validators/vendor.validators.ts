import { z } from "zod";

export const createVendorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email(),
});

export const updateVendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  address: z.string().min(1, "Vendor address is required"),
  email: z.string().min(1, "Vendor email is required"),
});
