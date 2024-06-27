import { z } from "zod";
import { userRoles } from "~/constants";

export const createUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  role: z.enum(userRoles, { message: "Invalid role" }),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  role: z.enum(userRoles, { message: "Invalid role" }).optional(),
  profilePicture: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});
