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

const Vendors = async ({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
  };
}) => {
  console.log(searchParams?.limit);
  const { total, data: vendors } = await getVendors({
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
                <BreadcrumbPage>Vendors</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <TypographyH3>Vendor List</TypographyH3>
        </div>

        <div>
          <CreateVendorModal />
        </div>
      </header>

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
                <TableCell>{vendor.email}</TableCell>
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
                <TableCell className="space-x-2 text-center">
                  {/* <Link */}
                  {/*   href={`/dashboard/users/${vendor.id}`} */}
                  {/*   className={buttonVariants({ */}
                  {/*     size: "icon", */}
                  {/*     variant: "outline", */}
                  {/*     className: "hover:text-white", */}
                  {/*   })} */}
                  {/* > */}
                  {/*   <EyeOpenIcon /> */}
                  {/* </Link> */}
                  <UpdateVendorModal vendor={vendor} />
                  <DeleteVendorModal id={vendor.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>

      <footer className="pt-5">
        <HandlePagination total={total} />
      </footer>
    </div>
  );
};

export default Vendors;
