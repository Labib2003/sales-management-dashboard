"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type z } from "zod";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { createUserSchema } from "~/validators/user.validators";
import crypto from "crypto";
import bcrypt from "bcrypt";
import transporter from "~/lib/nodemailer";

type FormState = {
  success: boolean;
  message: string;
};

export async function createUser(
  data: z.infer<typeof createUserSchema>,
): Promise<FormState> {
  const parsedData = createUserSchema.safeParse(data);

  if (!parsedData.success) return { success: false, message: "Invalid data" };

  try {
    const initialPassword = crypto.randomUUID().split("-")[0]!;
    const hashedPassword = await bcrypt.hash(initialPassword, 10);

    await db
      .insert(users)
      .values({ ...parsedData.data, password: hashedPassword });

    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: parsedData.data.email,
      subject: "Your New Auto-Generated Password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Welcome!</h2>
          <p>Your new account has been successfully created. Below is your auto-generated password:</p>
          <p style="font-size: 16px; font-weight: bold; color: #333;">${initialPassword}</p>
          <p>For security reasons, we strongly recommend that you change this password to a custom one as soon as possible.</p>
          <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
          <p>Best regards,</p>
          <p>Your Company Name</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);

    revalidatePath("/dashboard/users");
  } catch (error) {
    const castedError = error as Error;
    return {
      success: false,
      message: castedError.message ?? "An error occurred",
    };
  }

  return { success: true, message: "User created" };
}

export async function deleteUser(userId: number): Promise<FormState> {
  try {
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/dashboard/users");
    return { success: true, message: "User deleted" };
  } catch (error) {
    const castedError = error as Error;
    return {
      success: false,
      message: castedError.message ?? "An error occurred",
    };
  }
}