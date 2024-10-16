import { z } from "zod";
import { userRoles } from "~/constants";

export const createUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email().toLowerCase(),
  role: z.enum(userRoles, { message: "Invalid role" }),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  role: z.enum(userRoles, { message: "Invalid role" }),
  profile_picture: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});
