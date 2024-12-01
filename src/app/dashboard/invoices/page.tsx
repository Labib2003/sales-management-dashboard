import Link from "next/link";
import HandlePagination from "~/components/custom/HandlePagination";
import HandleSearch from "~/components/custom/HandleSearch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { buttonVariants } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { TypographyH3 } from "~/components/ui/typography";
import { getInvoices } from "~/server/queries/invoice.queries";
import InvoiceDetailsModal from "./InvoiceDetailsModal";
import DeleteInvoiceModal from "./DeleteInvoiceModal";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { getCurrentUser } from "~/server/actions/auth.actions";
import { type smd_User, type smd_Role } from "@prisma/client";
import { redirect } from "next/navigation";

const InvoicesTable = async ({
  searchParams,
  currentUser,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
  };
  currentUser?: smd_User;
}) => {
  const { total, data: invoices } = await getInvoices({
    page: parseInt(searchParams?.page ?? "1"),
    limit: parseInt(searchParams?.limit ?? "10"),
    search: searchParams?.search,
  });

  return (
    <>
      <main>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Customer Contact</TableHead>
              <TableHead>Customer Address</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.customer_name}</TableCell>
                <TableCell>{invoice.customer_contact}</TableCell>
                <TableCell>
                  {invoice.customer_address ? (
                    invoice.customer_address.length > 10 ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="max-w-[12ch] truncate">
                              {invoice.customer_address}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent className="w-[500px] bg-card text-foreground shadow-md">
                            <p>{invoice.customer_address}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      invoice.customer_address
                    )
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="flex flex-wrap justify-center gap-2">
                  <InvoiceDetailsModal items={invoice.items} />
                  {(
                    ["superadmin", "admin", "manager", "demo"] as smd_Role[]
                  ).includes(currentUser?.role ?? "guest") && (
                    <DeleteInvoiceModal invoiceId={invoice.id} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
      <footer className="pt-5">
        <HandlePagination total={total} />
      </footer>
    </>
  );
};

const Invoices = async ({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
  };
}) => {
  // guests cannot access this page
  const currentUser = await getCurrentUser();
  if (
    !(
      ["superadmin", "admin", "manager", "salesman", "demo"] as smd_Role[]
    ).includes(currentUser?.role ?? "guest")
  )
    redirect("/dashboard");

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
                <BreadcrumbPage>Invoices</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <TypographyH3>Invoice List</TypographyH3>
        </div>

        <div className="flex gap-2">
          <HandleSearch />
          {(
            ["superadmin", "admin", "manager", "salesman", "demo"] as smd_Role[]
          ).includes(currentUser?.role ?? "guest") && (
            <Link
              href="/dashboard/invoices/create"
              className={buttonVariants()}
            >
              Create Invoice
            </Link>
          )}
        </div>
      </header>

      <Suspense
        fallback={
          <div className="space-y-2">
            <Skeleton className="h-[40px]" />
            <Skeleton className="h-[40px]" />
            <Skeleton className="h-[40px]" />
          </div>
        }
      >
        <InvoicesTable
          searchParams={searchParams}
          currentUser={currentUser ?? undefined}
        />
      </Suspense>
    </div>
  );
};

export default Invoices;
