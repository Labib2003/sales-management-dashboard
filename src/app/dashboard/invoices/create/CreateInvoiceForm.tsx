"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type smd_ProductPrice,
  type smd_Vendor,
  type smd_Product,
} from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import AddToCartModal from "./AddToCartModal";
import { TypographyH4 } from "~/components/ui/typography";
import HandleSearch from "~/components/custom/HandleSearch";
import HandlePagination from "~/components/custom/HandlePagination";
import { XIcon } from "lucide-react";
import { customerInfoSchema } from "~/validators/invoice.validators";
import { createInvoice } from "~/server/actions/invoice.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type CartItem = smd_Product & {
  prices: smd_ProductPrice[];
  package_quantity: number;
  unit_quantity: number;
};

const CreateInvoiceForm = ({
  products,
  totalProductPages,
}: {
  products: (smd_Product & {
    vendor: smd_Vendor;
    prices: smd_ProductPrice[];
  })[];
  totalProductPages: number;
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const form = useForm<z.infer<typeof customerInfoSchema>>({
    resolver: zodResolver(customerInfoSchema),
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof customerInfoSchema>) {
    if (!cartItems.length)
      return toast.error("At least one item is required in the cart");
    const res = await createInvoice({
      ...values,
      items: cartItems.map((itm) => ({
        product_price_id: itm.prices[0]!.id,
        package_quantity: itm.package_quantity,
        unit_quantity: itm.unit_quantity,
      })),
    });
    toast[res.success ? "success" : "error"](res.message);
    if (res.success) {
      form.reset();
      router.push("/dashboard/invoices");
    }
  }

  return (
    <div className="relative pb-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer_contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Contact *</FormLabel>
                  <FormControl>
                    <Input placeholder="phone or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer_address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Customer Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="221B Baker Street"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="absolute bottom-0 right-0 w-fit"
            size="lg"
          >
            Submit
          </Button>
        </form>
      </Form>

      <div className="grid grid-cols-2 gap-5 pt-5">
        <div className="border-e py-3 pe-5">
          <div className="mb-3 flex justify-between">
            <TypographyH4>All Products</TypographyH4>
            <HandleSearch />
          </div>
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
                    <AddToCartModal
                      product={product}
                      setCartItems={setCartItems}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-5">
            <HandlePagination total={totalProductPages} />
          </div>
        </div>

        <div className="py-3 ps-0">
          <div className="mb-3 flex items-center justify-between">
            <TypographyH4>Cart</TypographyH4>
            <Input className="pointer-events-none  opacity-0" />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Package Price</TableHead>
                <TableHead>Package Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Unit Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell className="capitalize">{item.name}</TableCell>
                    <TableCell>
                      {item.prices[0]?.package_price
                        ? "$" + item.prices[0].package_price / 100
                        : null}
                    </TableCell>
                    <TableCell className="capitalize">
                      {item.package_quantity}
                    </TableCell>
                    <TableCell>
                      {item.prices[0]?.unit_price
                        ? "$" + item.prices[0].unit_price / 100
                        : "N/A"}
                    </TableCell>
                    <TableCell className="capitalize">
                      {item.unit_quantity}
                    </TableCell>
                    <TableCell className="capitalize">
                      $
                      {(item.package_quantity * item.prices[0]!.package_price +
                        item.unit_quantity *
                          (item.prices[0]!.unit_price ?? 0)) /
                        100}
                    </TableCell>
                    <TableCell className="space-x-2 text-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setCartItems((prev) => {
                            return prev.filter((itm) => itm.id !== item.id);
                          });
                        }}
                      >
                        <XIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="font-bold">Grand total: </TableCell>
                <TableCell>
                  $
                  {cartItems.reduce((acc, curr) => {
                    return (acc +=
                      (curr.package_quantity * curr.prices[0]!.package_price +
                        curr.unit_quantity *
                          (curr.prices[0]!.unit_price ?? 0)) /
                      100);
                  }, 0)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceForm;
