"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type smd_Vendor } from "@prisma/client";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

const formSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Product description is required"),
    package: z.string().min(1, "Package type is required"),
    unit: z.string().optional(),
    vendor_id: z.string().min(1, "Vendor is required"),
    package_price: z.coerce
      .number()
      .min(1, "Package price cannot be 0 or negative"),
    unit_price: z.coerce
      .number()
      .min(1, "Unit price cannot be 0 or negative")
      .optional(),
  })
  .refine(
    (values) => {
      return (
        (!!values.unit && !!values.unit_price) ||
        (!values.unit && !values.unit_price)
      );
    },
    {
      message: "Both unit and unit price are required",
      path: ["unit"],
    },
  )
  .refine(
    (values) => {
      return (
        (!!values.unit && !!values.unit_price) ||
        (!values.unit && !values.unit_price)
      );
    },
    {
      message: "Both unit and unit price are required",
      path: ["unit_price"],
    },
  );

const CreateProductModal = ({ vendors }: { vendors: smd_Vendor[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [vendorSearchTerm, setVendorSearchTerm] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      package: "",
      vendor_id: "",
      package_price: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (vendorSearchTerm) params.set("vendor-search", vendorSearchTerm);
    else params.delete("vendor-search");

    const searchVendors = setTimeout(
      () => router.replace(`${pathname}?${params.toString()}`),
      500,
    );

    return () => clearTimeout(searchVendors);
  }, [vendorSearchTerm, pathname, router, searchParams]);

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants()}>Add product</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new product</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product description *</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vendor_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Vendor *</FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="default"
                          type="button"
                          role="combobox"
                          className={cn(
                            "justify-between border bg-transparent text-foreground hover:bg-transparent",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? vendors
                              .map((v) => ({ label: v.name, value: v.id }))
                              .find((vendor) => vendor.value === field.value)
                              ?.label
                            : "Select vendor"}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search vendor name..."
                          className="h-9"
                          onValueChange={setVendorSearchTerm}
                        />
                        <CommandList>
                          <CommandEmpty>No vendors matched.</CommandEmpty>
                          <CommandGroup>
                            {vendors
                              .map((v) => ({ label: v.name, value: v.id }))
                              .map((vendor) => (
                                <CommandItem
                                  value={vendor.value}
                                  key={vendor.value}
                                  onSelect={() => {
                                    form.setValue("vendor_id", vendor.value);
                                  }}
                                  onClick={console.log}
                                >
                                  {vendor.label}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      vendor.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="package"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="package_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Price *</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductModal;
