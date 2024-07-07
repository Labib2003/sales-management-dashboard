"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import bcrypt from "bcrypt";
import { lucia } from "~/lib/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateRequest } from "~/lib/validateRequest";
import { type ActionResult } from "next/dist/server/app-render/types";

type Response = {
  success: boolean;
  message: string;
};

export async function login(
  email: string,
  password: string,
): Promise<Response | undefined> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()));
  if (!user) return { success: false, message: "User not found" };
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
  const [currentUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, user?.id ?? ""));

  return currentUser;
};

export async function logout() {
  "use server";
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
