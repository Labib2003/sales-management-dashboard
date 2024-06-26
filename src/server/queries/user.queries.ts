import "server-only";
import { db } from "../db";

export async function getUsers() {
  return await db.query.users.findMany({
    columns: { password: false },
    where: (model, { eq }) => eq(model.active, true),
    orderBy: (model, { desc }) => desc(model.createdAt),
  });
}
