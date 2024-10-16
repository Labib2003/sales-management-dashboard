import {
  ChatBubbleIcon,
  EnvelopeClosedIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import CopyButtonWrapper from "~/components/custom/CopyButtonWrapper";
import { Badge } from "~/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Card, CardContent } from "~/components/ui/card";
import {
  TypographyH3,
  TypographyLead,
  TypographyP,
} from "~/components/ui/typography";
import { getUserById } from "~/server/queries/user.queries";
import UpdateUserInfoModal from "./UpdateUserInfoModal";
import { getCurrentUser } from "~/server/actions/auth.actions";

const UserDetailsPage = async ({ params }: { params: { id: string } }) => {
  const userData = await getUserById(params.id);
  const currentUser = await getCurrentUser();

  if (!userData) return "User not found";

  return (
    <div>
      <header className="mb-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard/users">Users</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{params.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <TypographyH3>User Details</TypographyH3>
      </header>

      <main>
        <Card className="max-w-screen-md px-5 py-5 ps-8">
          <CardContent className="grid grid-cols-3 gap-10">
            <div className="flex items-center">
              <Image
                src={
                  userData?.profile_picture ??
                  "/assets/images/profile_picture_placeholder.jpg"
                }
                height={500}
                width={500}
                alt={`profile picture of ${userData?.name}`}
                className="w-full rounded border"
              />
            </div>

            <div className="col-span-2">
              <div className="mb-3 flex justify-between">
                <div>
                  <TypographyLead>{userData.name}</TypographyLead>
                  <Badge className="uppercase">{userData.role}</Badge>
                </div>

                {currentUser?.id === userData.id && (
                  <UpdateUserInfoModal userData={userData} />
                )}
              </div>
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UserDetailsPage;
