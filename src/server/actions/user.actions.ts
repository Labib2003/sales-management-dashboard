"use server";

import { revalidatePath } from "next/cache";
import { type z } from "zod";
import { db } from "~/server/db";
import {
  createUserSchema,
  updateUserSchema,
} from "~/validators/user.validators";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { validateRequest } from "~/lib/validateRequest";
import { type Response } from "../types";
import transporter from "~/lib/nodemailer";
import { catchAcync } from "~/lib/utils";

export async function createUser(
  data: z.infer<typeof createUserSchema>,
): Promise<Response> {
  const { user } = await validateRequest();
  if (!["superadmin", "admin"].includes(user?.role ?? ""))
    return { success: false, message: "Unauthorized" };

  const parsedData = createUserSchema.safeParse(data);
  if (!parsedData.success) return { success: false, message: "Invalid data" };

  return catchAcync(async () => {
    const initialPassword = crypto.randomUUID().split("-")[0]!;
    const hashedPassword = await bcrypt.hash(initialPassword, 10);

    await db.smd_User.create({
      data: {
        ...parsedData.data,
        password: hashedPassword,
      },
    });

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
    return {
      success: true,
      message:
        "User created with auto generated password. The password is mailed to the user.",
    };
  });
}

export async function deleteUser(userId: string): Promise<Response> {
  const { user } = await validateRequest();
  if (!["superadmin", "admin"].includes(user?.role ?? ""))
    return { success: false, message: "Unauthorized" };

  return catchAcync(async () => {
    await db.smd_User.update({
      where: { id: userId },
      data: { active: false },
    });
    revalidatePath("/dashboard/users");
    return { success: true, message: "User deleted" };
  });
}

export async function updateUser(
  userId: string,
  data: z.infer<typeof updateUserSchema>,
): Promise<Response> {
  const { user } = await validateRequest();
  const parsedData = updateUserSchema.safeParse(data);
  if (!parsedData.success) return { success: false, message: "Invalid data" };
  let updateData: Record<string, unknown> = {};

  if (user?.id === userId) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, ...data } = parsedData.data;
    updateData = data;
  } else if (["superadmin", "admin"].includes(user?.role ?? "")) {
    const { role } = parsedData.data;
    updateData = { role };
  } else return { success: false, message: "Unauthorized" };

  console.log(updateData);

  return catchAcync(async () => {
    await db.smd_User.update({ where: { id: userId }, data: updateData });
    revalidatePath("/dashboard/users");
    return { success: true, message: "User updated" };
  });
}
