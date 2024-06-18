import { TrashIcon } from "@radix-ui/react-icons";
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

const DeleteUserModal = () => {
  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({ size: "icon", variant: "destructive" })}
      >
        <TrashIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            account and remove its data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" size={"sm"}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" size={"sm"}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserModal;
