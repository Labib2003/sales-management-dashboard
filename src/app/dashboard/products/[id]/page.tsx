import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  TypographyH3,
  TypographyH4,
  TypographyLarge,
  TypographyLead,
  TypographyP,
} from "~/components/ui/typography";
import { getProductById } from "~/server/queries/product.queries";
import PriceHistoryChart from "./PriceHistoryChart";

const ProductDetails = async ({ params }: { params: { id: string } }) => {
  const product = await getProductById(params.id);

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
                  <Link href="/dashboard/products">Products</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{params.id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <TypographyH3>Product Details</TypographyH3>
        </div>
      </header>

      <main>
        {product ? (
          <div>
            <div className="mb-5 grid grid-cols-1 gap-10 rounded-lg bg-muted p-5 py-8 shadow shadow-black/30 md:grid-cols-2">
              <div className="flex flex-col justify-between">
                <div>
                  <TypographyH4 className="mb-2 border-b">
                    Product Info:
                  </TypographyH4>
                  <TypographyLead className="capitalize">
                    {product.name}
                  </TypographyLead>
                  <TypographyLarge className="mb-2 font-normal">
                    {product.description}
                  </TypographyLarge>
                </div>

                <TypographyP>
                  Package:{" "}
                  <span className="font-bold capitalize">
                    {product.package}
                  </span>
                  <br />
                  Unit:{" "}
                  <span className="font-bold capitalize">
                    {product.unit ?? "N/A"}
                  </span>
                </TypographyP>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <TypographyH4 className="mb-2 border-b">
                    Vendor Info:
                  </TypographyH4>
                  <TypographyLead className="capitalize">
                    {product.vendor.name}
                  </TypographyLead>
                  <TypographyLarge className="mb-2 font-normal">
                    Active Products: {product.vendor._count.products}
                  </TypographyLarge>
                </div>

                <TypographyP>
                  Contact:{" "}
                  <span className="font-bold">{product.vendor.email}</span>
                  <br />
                  Address:{" "}
                  <span className="font-bold capitalize">
                    {product.vendor.address}
                  </span>
                </TypographyP>
              </div>
            </div>

            <PriceHistoryChart history={product.prices} />
          </div>
        ) : (
          <TypographyH4>Product not found</TypographyH4>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;
