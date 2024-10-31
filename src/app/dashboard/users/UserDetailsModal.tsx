"use client";

import { type smd_User } from "@prisma/client";
import {
  ChatBubbleIcon,
  EnvelopeClosedIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import CopyButtonWrapper from "~/components/custom/CopyButtonWrapper";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { TypographyLead, TypographyP } from "~/components/ui/typography";

const UserDetailsModal = ({ userData }: { userData: smd_User }) => {
  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({ size: "icon", variant: "outline" })}
      >
        <EyeIcon />
      </DialogTrigger>
      <DialogContent className="overflow-x-auto">
        <div>
          <div className="relative mb-3">
            <Image
              src={
                userData?.profile_picture ??
                "/assets/images/profile_picture_placeholder.jpg"
              }
              height={200}
              width={200}
              alt={`profile picture of ${userData?.name}`}
              className="w-full rounded-md border"
            />
            <div className="absolute bottom-0 left-0 mb-3 ms-3 flex justify-between rounded-md bg-white/50 p-2 px-3">
              <div>
                <TypographyLead>{userData.name}</TypographyLead>
                <Badge className="uppercase">{userData.role}</Badge>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <TypographyP className="pe-10">
              <span className="flex items-baseline gap-3">
                <EnvelopeClosedIcon />
                <CopyButtonWrapper>{userData.email}</CopyButtonWrapper>
              </span>
              <span className="flex items-baseline gap-3">
                <ChatBubbleIcon />
                <CopyButtonWrapper disabled={!userData.phone}>
                  {userData?.phone ?? "Phone number not available"}
                </CopyButtonWrapper>
              </span>
              <span className="flex items-baseline gap-3">
                <div>
                  <HomeIcon />
                </div>
                <CopyButtonWrapper disabled={!userData.address}>
                  {userData?.address ?? "Address not available"}
                </CopyButtonWrapper>
              </span>
            </TypographyP>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
