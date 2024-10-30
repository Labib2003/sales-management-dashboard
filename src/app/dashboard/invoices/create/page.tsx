import Link from "next/link";
import { TypographyH3 } from "~/components/ui/typography";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import CreateInvoiceForm from "./CreateInvoiceForm";
import { getProducts } from "~/server/queries/product.queries";

const CreateNewInvoice = async ({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
  };
}) => {
  const { total, data: products } = await getProducts({
    page: parseInt(searchParams?.page ?? "1"),
    limit: parseInt(searchParams?.limit ?? "10"),
    search: searchParams?.search,
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
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/invoices">Invoices</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <TypographyH3>Create New Invoice</TypographyH3>
        </div>
      </header>

      <main>
        <CreateInvoiceForm products={products} totalProductPages={total} />
      </main>
    </div>
  );
};

export default CreateNewInvoice;
