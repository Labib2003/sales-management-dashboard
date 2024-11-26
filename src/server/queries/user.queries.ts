import "server-only";
import { db } from "../db";
import { type Prisma, type smd_User } from "@prisma/client";

type UserField = keyof smd_User;
type GetUserArgs = {
  page: number;
  limit: number;
  search?: string;
} & Partial<Record<UserField, string | undefined>>;

export async function getUsers(arg: GetUserArgs) {
  const { page, limit, search = "", ...rest } = arg;

  const searchableFields: UserField[] = ["name", "email"];

  const searchConditions: Prisma.smd_UserWhereInput[] = searchableFields.map(
    (field) => {
      return {
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      };
    },
  );
  const filterConditions: Prisma.smd_UserWhereInput[] = Object.entries(
    rest,
  ).map(([k, v]) => {
    return { [k]: v };
  });

  const whereConditions: Prisma.smd_UserWhereInput = {
    AND: [
      { OR: searchConditions },
      { AND: [{ active: true }, ...filterConditions] },
    ],
  };

  const [total, data] = await Promise.all([
    await db.smd_User.count({ where: whereConditions }),

    await db.smd_User.findMany({
      where: whereConditions,
      skip: (Math.max(1, page) - 1) * limit,
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        _count: {
          select: {
            sales: {
              where: {
                created_at: {
                  gte: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days ago
                },
              },
            },
          },
        },
      },
    }),
  ]);

  return { total, data };
}

export async function getUserById(id: string) {
  const user = await db.smd_User.findUnique({ where: { id } });

  return user;
}
