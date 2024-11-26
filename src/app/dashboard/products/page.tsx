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
import HandleSearch from "~/components/custom/HandleSearch";
import DeleteProductModal from "./DeleteProductModal";
import UpdateProductModal from "./UpdateProductModal";
import { EyeIcon } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";

type SearchParams = {
  "vendor-search"?: string;
  "vendor-page"?: string;
  "vendor-limit"?: string;
  page?: string;
  limit?: string;
  search?: string;
};

const ProductsTable = async ({
  searchParams,
}: {
  searchParams?: SearchParams;
}) => {
  const { total, data: products } = await getProducts({
    page: parseInt(searchParams?.page ?? "1"),
    limit: parseInt(searchParams?.limit ?? "10"),
    search: searchParams?.search,
  });
  const vendors = await getVendors({
    page: parseInt(searchParams?.["vendor-page"] ?? "1"),
    limit: parseInt(searchParams?.["vendor-limit"] ?? "10"),
    search: searchParams?.["vendor-search"],
  });

  return (
    <>
      <main>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Vendor</TableHead>
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
                <TableCell>{product.vendor.name}</TableCell>
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
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "icon",
                    })}
                  >
                    <EyeIcon />
                  </Link>
                  <UpdateProductModal
                    vendors={vendors.data}
                    product={product}
                  />
                  <DeleteProductModal productId={product.id} />
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

const CreateProductModalWrapper = async ({
  searchParams,
}: {
  searchParams?: SearchParams;
}) => {
  const vendors = await getVendors({
    page: parseInt(searchParams?.["vendor-page"] ?? "1"),
    limit: parseInt(searchParams?.["vendor-limit"] ?? "10"),
    search: searchParams?.["vendor-search"],
  });

  return <CreateProductModal vendors={vendors.data} />;
};

const Products = async ({ searchParams }: { searchParams?: SearchParams }) => {
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

        <div className="flex gap-2">
          <HandleSearch />
          <Suspense
            fallback={
              <Skeleton>
                <Button className="opacity-0">Add Product</Button>
              </Skeleton>
            }
          >
            <CreateProductModalWrapper searchParams={searchParams} />
          </Suspense>
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
        <ProductsTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default Products;
