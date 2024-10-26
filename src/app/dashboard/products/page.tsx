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
import { getProducts } from "~/server/queries/product.queries";
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
import HandlePagination from "~/components/custom/HandlePagination";

const Products = async ({
  searchParams,
}: {
  searchParams?: {
    "vendor-search"?: string;
    page?: string;
    limit?: string;
    search?: string;
  };
}) => {
  const vendors = await getVendors({
    page: 1,
    limit: 10,
    search: searchParams?.["vendor-search"],
  });
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

      <main>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Package Price</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="capitalize">{product.name}</TableCell>
                <TableCell>
                  {product.description.length > 10 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="max-w-[12ch] truncate">
                            {product.description}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent className="w-[500px] bg-card text-foreground shadow-md">
                          <p>{product.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    product.description
                  )}
                </TableCell>
                <TableCell>{product.package}</TableCell>
                <TableCell>
                  {product.prices[0]?.package_price
                    ? "$" + product.prices[0].package_price / 100
                    : null}
                </TableCell>
                <TableCell>{product.unit ?? "N/A"}</TableCell>
                <TableCell>
                  {product.prices[0]?.unit_price
                    ? "$" + product.prices[0].unit_price / 100
                    : "N/A"}
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
                  {/* <UpdateVendorModal vendor={product} /> */}
                  {/* <DeleteVendorModal id={product.id} /> */}
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

export default Products;
