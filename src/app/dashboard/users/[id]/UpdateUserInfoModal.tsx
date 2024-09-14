"use client";

import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useState } from "react";
import CropImageModal from "./CropImageModal";
import { TypographyLead } from "~/components/ui/typography";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { type users } from "~/server/db/schema";
import { uploadIoImgBB } from "~/server/actions/utils.actions";
import { toast } from "sonner";
import { updateUser } from "~/server/actions/user.actions";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z.string(),
  address: z.string(),
});

const UpdateUserInfoModal = ({
  userData,
}: {
  userData: typeof users.$inferSelect;
}) => {
  const [open, setOpen] = useState(false);
  const croppedIMageInitialValue =
    userData.profilePicture ?? "/assets/images/profile_picture_placeholder.jpg";
  const [croppedImage, setCroppedImage] = useState(croppedIMageInitialValue);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData.name,
      phone: userData.phone ?? "",
      address: userData.address ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data: Record<string, string> = {};
    Object.entries(values).forEach(([k, v]) => {
      if (v !== "") data[k] = v;
    });

    if (croppedImage !== croppedIMageInitialValue) {
      const sizeInBytes =
        croppedImage.split("base64,")[1]!.length * (3 / 4) -
        croppedImage
          .slice(-2)
          .split("")
          .reduce((acc, curr) => {
            if (curr === "=") return acc + 1;
            return acc;
          }, 0);

      // nextjs limit
      if (sizeInBytes / (1024 * 1024) > 1)
        return toast.error("Image is too large. Max size 1MB");

      const res = await uploadIoImgBB(croppedImage);
      toast[res.success ? "success" : "error"](res.message);

      if (res.success) data.profilePicture = res.data?.url as string;
    }

    const res = await updateUser(userData.id, data);
    toast[res.success ? "success" : "error"](res.message);
    setOpen(!res.success);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <Pencil2Icon />
      </DialogTrigger>

      <DialogContent className="max-w-screen-md">
        <DialogHeader>
          <DialogTitle className="mb-3">Update Profile Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-5">
          <div className="border-e">
            <CropImageModal
              croppedImage={croppedImage}
              setCroppedImage={setCroppedImage}
            />
          </div>

          <div className="col-span-2">
            <TypographyLead className="mb-3">Other Details:</TypographyLead>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="0123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="221B Baker Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="!mt-5 flex justify-end">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserInfoModal;
