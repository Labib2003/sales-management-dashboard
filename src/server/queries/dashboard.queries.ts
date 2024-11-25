import "server-only";
import { db } from "../db";

export async function getDashboardStats() {
  const [totalVendors, totalProducts, itemsSold] = await Promise.all([
    await db.smd_Vendor.count({ where: { active: true } }),
    await db.smd_Product.count({ where: { active: true } }),
    await db.smd_InvoiceItem.findMany({
      include: { product_price: true },
    }),
  ]);

  const totalRevenue = itemsSold.reduce((acc, curr) => {
    return (
      acc +
      curr.package_quantity * curr.product_price.package_price +
      curr.unit_quantity * curr.product_price.unit_price!
    );
  }, 0);
  const revenueThisWeek = itemsSold
    .filter(
      (itm) =>
        itm.created_at >=
        new Date(new Date().setDate(new Date().getDate() - 7)),
    )
    .reduce((acc, curr) => {
      return (
        acc +
        curr.package_quantity * curr.product_price.package_price +
        curr.unit_quantity * curr.product_price.unit_price!
      );
    }, 0);

  return { totalVendors, totalProducts, totalRevenue, revenueThisWeek };
}
