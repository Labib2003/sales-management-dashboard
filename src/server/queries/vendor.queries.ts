import "server-only";
import { type Prisma, type smd_Vendor } from "@prisma/client";
import { db } from "../db";

type VendorField = keyof smd_Vendor;
type GetVendorArgs = {
  page: number;
  limit: number;
  search?: string;
} & Partial<Record<VendorField, string | undefined>>;

export async function getVendors(arg: GetVendorArgs) {
  const { page, limit, search = "", ...rest } = arg;

  const searchableFields: VendorField[] = ["name", "email"];

  const searchConditions: Prisma.smd_VendorWhereInput[] = searchableFields.map(
    (field) => {
      return {
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      };
    },
  );
  const filterConditions: Prisma.smd_VendorWhereInput[] = Object.entries(
    rest,
  ).map(([k, v]) => {
    return { [k]: v };
  });

  const whereConditions: Prisma.smd_VendorWhereInput = {
    AND: [
      { OR: searchConditions },
      { AND: [{ active: true }, ...filterConditions] },
    ],
  };

  const [total, data] = await Promise.all([
    await db.smd_Vendor.count({ where: whereConditions }),

    await db.smd_Vendor.findMany({
      where: whereConditions,
      skip: (Math.max(1, page) - 1) * limit,
      take: limit,
      orderBy: { created_at: "desc" },
    }),
  ]);

  return { total, data };
}
