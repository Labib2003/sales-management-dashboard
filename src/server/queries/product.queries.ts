import { type Prisma, type smd_Product } from "@prisma/client";
import { db } from "../db";

type ProductField = keyof smd_Product;
type GetProductsArgs = {
  page: number;
  limit: number;
  search?: string;
} & Partial<Record<ProductField, string | undefined>>;

export async function getProducts(arg: GetProductsArgs) {
  const { page, limit, search = "", ...rest } = arg;

  const searchableFields: ProductField[] = ["name", "description", "package"];

  const searchConditions: Prisma.smd_ProductWhereInput[] = searchableFields.map(
    (field) => {
      return {
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      };
    },
  );
  const filterConditions: Prisma.smd_ProductWhereInput[] = Object.entries(
    rest,
  ).map(([k, v]) => {
    return { [k]: v };
  });

  const whereConditions: Prisma.smd_ProductWhereInput = {
    AND: [
      { OR: searchConditions },
      { AND: [{ active: true }, ...filterConditions] },
    ],
  };

  const [total, data] = await Promise.all([
    await db.smd_Product.count({ where: whereConditions }),

    await db.smd_Product.findMany({
      where: whereConditions,
      skip: (Math.max(1, page) - 1) * limit,
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        prices: { orderBy: { created_at: "desc" }, take: 1 },
        vendor: true,
      },
    }),
  ]);

  return { total, data };
}

export async function getProductById(id: string) {
  const user = await db.smd_Product.findUnique({
    where: { id },
    include: {
      vendor: {
        include: {
          _count: { select: { products: { where: { active: true } } } },
        },
      },
      prices: {
        include: { invoice_history: true },
        orderBy: { created_at: "desc" },
        take: 10,
      },
    },
  });

  return user;
}
