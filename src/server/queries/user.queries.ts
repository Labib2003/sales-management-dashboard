import "server-only";

import { db } from "../db";
import { users } from "../db/schema";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";

type UserField = keyof typeof users.$inferSelect;
type GetUserArgs = {
  page?: number;
  limit?: number;
  search?: string;
} & Partial<Record<UserField, string | undefined>>;

export async function getUsers(arg: GetUserArgs) {
  const { page = 1, limit = 10, search = "", ...rest } = arg;

  const searchableFields: UserField[] = ["name", "email"];

  const searchConditions = or(
    ...searchableFields.map((field) => ilike(users[field], `%${search}%`)),
  );
  const filterConditions = and(
    eq(users.active, true),
    ...Object.entries(rest).map(([key, value]) => {
      if (value) return eq(users[key as UserField], value);
    }),
  );

  const [[total], data] = await Promise.all([
    await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.active, true)),

    await db
      .select()
      .from(users)
      .where(and(filterConditions, searchConditions))
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset((Math.max(1, page) - 1) * limit),
  ]);

  return { total: total?.count ?? 0, data };
}
