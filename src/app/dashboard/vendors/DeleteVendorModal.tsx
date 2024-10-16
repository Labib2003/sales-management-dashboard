"use client";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { deleteVendor } from "~/server/actions/vendor.actions";

const DeleteVendorModal = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ size: "icon", variant: "destructive" })}
      >
        <Trash2Icon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This will mark this vendor as inactive. The data will still persist
            in our database in order to perserve any relationships with other
            entities.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={async () => {
              const res = await deleteVendor(id);
              if (res.success) setOpen(false);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteVendorModal;
