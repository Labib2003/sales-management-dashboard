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
import CreateVendorModal from "./CreateVendorModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getVendors } from "~/server/queries/vendor.queries";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import HandlePagination from "~/components/custom/HandlePagination";
import DeleteVendorModal from "./DeleteVendorModal";
import UpdateVendorModal from "./UpdateVendorModal";
import HandleSearch from "~/components/custom/HandleSearch";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { getCurrentUser } from "~/server/actions/auth.actions";
import { type smd_User, type smd_Role } from "@prisma/client";
import { redirect } from "next/navigation";

const VendorsTable = async ({
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
  const { total, data: vendors } = await getVendors({
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
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="capitalize">{vendor.name}</TableCell>
                <TableCell>
                  {vendor.address ? (
                    vendor.address.length > 10 ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="max-w-[12ch] truncate">
                              {vendor.address}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent className="w-[500px] bg-card text-foreground shadow-md">
                            <p>{vendor.address}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      vendor.address
                    )
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell className="space-x-2 text-center">
                  {(["superadmin", "admin"] as smd_Role[]).includes(
                    currentUser?.role ?? "guest",
                  ) && (
                    <>
                      <UpdateVendorModal vendor={vendor} />
                      <DeleteVendorModal id={vendor.id} />
                    </>
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

export default async function Vendors({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
  };
}) {
  // only admins and managers can access this page
  const currentUser = await getCurrentUser();
  if (
    !(["superadmin", "admin", "manager"] as smd_Role[]).includes(
      currentUser?.role ?? "guest",
    )
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
                <BreadcrumbPage>Vendors</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <TypographyH3>Vendor List</TypographyH3>
        </div>

        <div className="flex gap-2">
          <HandleSearch />

          {(["superadmin", "admin", "manager"] as smd_Role[]).includes(
            currentUser?.role ?? "guest",
          ) && <CreateVendorModal />}
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
        <VendorsTable
          searchParams={searchParams}
          currentUser={currentUser ?? undefined}
        />
      </Suspense>
    </div>
  );
}
