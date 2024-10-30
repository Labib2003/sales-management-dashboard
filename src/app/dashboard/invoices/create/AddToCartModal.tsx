"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type CartItem } from "./CreateInvoiceForm";
import { type smd_Product, type smd_ProductPrice } from "@prisma/client";

const formSchema = z
  .object({
    package_quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
    unit_quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  })
  .refine(
    (values) => {
      return !!values.package_quantity || !!values.unit_quantity;
    },
    {
      message: "At least one quantity is required",
      path: ["package_quantity"],
    },
  );

const AddToCartModal = ({
  product,
  setCartItems,
}: {
  product: smd_Product & { prices: smd_ProductPrice[] };
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { package_quantity: 0, unit_quantity: 0 },
  });
  const [open, setOpen] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return [
          {
            ...existingItem,
            package_quantity:
              existingItem.package_quantity + values.package_quantity,
            unit_quantity: existingItem.unit_quantity + values.unit_quantity,
          },
          ...prev.filter((itm) => itm.id !== product.id),
        ];
      }
      return [
        {
          ...product,
          ...values,
        },
        ...prev,
      ];
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ size: "icon" })}>
        <PlusIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add this product to cart?</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="package_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={product.prices[0]!.unit_price == undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Add to cart</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartModal;
