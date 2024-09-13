"use client";

import { Pencil2Icon } from "@radix-ui/react-icons";
import { buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import "cropperjs/dist/cropper.css";
import { useState } from "react";
import CropImageModal from "./CropImageModal";
import { TypographyP } from "~/components/ui/typography";

const UpdateUserInfoModal = () => {
  const [croppedImage, setCroppedImage] = useState(
    "/assets/images/profile_picture_placeholder.jpg",
  );

  return (
    <Dialog>
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
          <div className="cols-span-2">
            <TypographyP>Other Details:</TypographyP>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserInfoModal;
