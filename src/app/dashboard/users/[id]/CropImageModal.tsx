"use client";

import { Pencil2Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog";
import Cropper, { type ReactCropperElement } from "react-cropper";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { TypographyP } from "~/components/ui/typography";

const CropImageModal = ({
  croppedImage,
  setCroppedImage,
}: {
  croppedImage: string;
  setCroppedImage: Dispatch<SetStateAction<string>>;
}) => {
  const [originalImage, setOriginalImage] = useState("");
  const cropperRef = useRef<ReactCropperElement>(null);

  return (
    <Dialog>
      <DialogTrigger className="w-fit p-0">
        <TypographyP>Profile Picture:</TypographyP>
        <div className="relative w-fit overflow-hidden">
          <Image src={croppedImage} height={100} width={100} alt={``} />

          <div className="absolute inset-0 grid cursor-pointer place-items-center bg-black/15 transition-all hover:scale-125">
            <Pencil2Icon className="text-white" height={28} width={28} />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent>
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

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              onClick={() => {
                if (typeof cropperRef.current?.cropper !== "undefined") {
                  setCroppedImage(
                    cropperRef.current?.cropper.getCroppedCanvas().toDataURL(),
                  );
                }
              }}
            >
              Crop Image
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropImageModal;
