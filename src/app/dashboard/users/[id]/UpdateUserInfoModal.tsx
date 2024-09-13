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
import { Input } from "~/components/ui/input";
import "cropperjs/dist/cropper.css";
import { useRef, useState } from "react";
import Cropper, { type ReactCropperElement } from "react-cropper";
import Image from "next/image";

const UpdateUserInfoModal = () => {
  const [originalImage, setOriginalImage] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const cropperRef = useRef<ReactCropperElement>(null);

  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <Pencil2Icon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>

        <div style={{ width: "100%" }}>
          <Input
            type="file"
            onChange={(e) => {
              e.preventDefault();
              const files = e.target.files;

              if (files?.length) {
                const reader = new FileReader();
                reader.onload = () => setOriginalImage(reader.result as string);
                reader.readAsDataURL(files[0] as Blob);
              }
            }}
          />
          <br />
          <br />
          {originalImage && (
            <Cropper
              style={{ height: 400, width: "100%" }}
              initialAspectRatio={1}
              preview=".img-preview"
              src={originalImage}
              ref={cropperRef}
              viewMode={1}
              guides={true}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              aspectRatio={1}
              background={false}
              responsive={true}
              checkOrientation={false}
            />
          )}
        </div>
        <div>
          <div className="box">
            <h1>
              <Button
                onClick={() => {
                  if (typeof cropperRef.current?.cropper !== "undefined") {
                    setCroppedImage(
                      cropperRef.current?.cropper
                        .getCroppedCanvas()
                        .toDataURL(),
                    );
                  }
                }}
              >
                Crop Image
              </Button>
            </h1>
            {!!croppedImage.length && (
              <Image
                width={200}
                height={200}
                src={croppedImage}
                alt="cropped"
              />
            )}
          </div>
        </div>
        <br style={{ clear: "both" }} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserInfoModal;
