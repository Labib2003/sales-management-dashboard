import { type Prisma, type smd_Invoice } from "@prisma/client";
import { db } from "../db";

type InvoiceField = keyof smd_Invoice;
type GetInvoiceArgs = {
  page: number;
  limit: number;
  search?: string;
} & Partial<Record<InvoiceField, string | undefined>>;

export async function getInvoices(arg: GetInvoiceArgs) {
  const { page, limit, search = "", ...rest } = arg;

  const searchableFields: InvoiceField[] = [
    "customer_name",
    "customer_contact",
  ];

  const searchConditions: Prisma.smd_InvoiceWhereInput[] = searchableFields.map(
    (field) => {
      return {
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      };
    },
  );
  const filterConditions: Prisma.smd_InvoiceWhereInput[] = Object.entries(
    rest,
  ).map(([k, v]) => {
    return { [k]: v };
  });

  const whereConditions: Prisma.smd_InvoiceWhereInput = {
    AND: [{ OR: searchConditions }, { AND: [...filterConditions] }],
  };

  const [total, data] = await Promise.all([
    await db.smd_Invoice.count({ where: whereConditions }),

    await db.smd_Invoice.findMany({
      where: whereConditions,
      skip: (Math.max(1, page) - 1) * limit,
      take: limit,
      orderBy: { created_at: "desc" },
    }),
  ]);

  return { total, data };
}
