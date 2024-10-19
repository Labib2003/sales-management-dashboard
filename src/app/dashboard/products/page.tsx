import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { TypographyH3 } from "~/components/ui/typography";
import CreateProductModal from "./CreateProductModal";
import { getVendors } from "~/server/queries/vendor.queries";

const Products = async ({
  searchParams,
}: {
  searchParams?: {
    "vendor-search"?: string;
  };
}) => {
  const vendors = await getVendors({
    page: 1,
    limit: 10,
    search: searchParams?.["vendor-search"],
  });

  return (
    <div>
      <header className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Products</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <TypographyH3>Product List</TypographyH3>
        </div>

        <div>
          <CreateProductModal vendors={vendors.data} />
        </div>
      </header>
    </div>
  );
};

export default Products;
