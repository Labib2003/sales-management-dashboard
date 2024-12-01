"use server";

import { db } from "../db";
import bcrypt from "bcrypt";
import { lucia } from "~/lib/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateRequest } from "~/lib/validateRequest";
import { type Response } from "../types";

export async function login(
  email: string,
  password: string,
): Promise<Response | undefined> {
  const user = await db.smd_User.findUnique({ where: { email } });
  if (!user) return { success: false, message: "User not found" };
  if (user.role === "guest")
    return {
      success: false,
      message:
        "No role assigned to the user yet. Contact an admin to get access",
    };
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return { success: false, message: "Invalid password" };

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/dashboard");
}

export const getCurrentUser = async () => {
  const { user } = await validateRequest();
  if (!user) return null;

  const currentUser = await db.smd_User.findUnique({
    where: { id: user.id },
  });

  return currentUser;
};

export async function logout() {
  const { session } = await validateRequest();
  if (!session) return;

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/auth/login");
}
