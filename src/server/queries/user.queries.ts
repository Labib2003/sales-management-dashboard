import "server-only";

import { db } from "../db";
import { users } from "../db/schema";
import { count, eq } from "drizzle-orm";

export async function getUsers(page = 1, limit = 10) {
  const [[total], data] = await Promise.all([
    await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.active, true)),

    await db.query.users.findMany({
      columns: { password: false },
      where: (model, { eq }) => eq(model.active, true),
      orderBy: (model, { desc }) => desc(model.createdAt),
      limit,
      offset: (Math.max(1, page) - 1) * limit,
    }),
  ]);

  return { total: total?.count ?? 0, data };
}
