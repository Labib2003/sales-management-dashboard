"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type smd_Vendor } from "@prisma/client";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
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
import { createProduct } from "~/server/actions/product.actions";
import { productValidationSchema } from "~/validators/product.validators";

const CreateProductModal = ({ vendors }: { vendors: smd_Vendor[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [vendorSearchTerm, setVendorSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const form = useForm<z.infer<typeof productValidationSchema>>({
    resolver: zodResolver(productValidationSchema),
    defaultValues: {
      name: "",
      description: "",
      package: "",
      vendor_id: "",
      package_price: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof productValidationSchema>) {
    const res = await createProduct({
      ...values,
      package_price: Math.floor(values.package_price * 100),
      unit_price: values.unit_price
        ? Math.floor(values.unit_price * 100)
        : undefined,
    });
    toast[res.success ? "success" : "error"](res.message);
    if (res.success) {
      setOpen(false);
      form.reset();
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorSearchTerm, pathname, router]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setPopoverOpen(false);
        setTimeout(() => setOpen(isOpen), 0);
      }}
    >
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
                  <Popover
                    open={popoverOpen}
                    onOpenChange={setPopoverOpen}
                    modal
                  >
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
                            {vendors.map((vendor) => (
                              <CommandItem
                                value={vendor.name}
                                key={vendor.id}
                                onSelect={() => {
                                  form.setValue("vendor_id", vendor.id);
                                }}
                                onClick={console.log}
                              >
                                {vendor.name}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    vendor.id === field.value
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
