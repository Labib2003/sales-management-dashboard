"use client";

import { useRef } from "react";
import { type ImperativePanelHandle } from "react-resizable-panels";
import { Button, buttonVariants } from "~/components/ui/button";
import { ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import styles from "./dashboard.module.css";
import {
  DashboardIcon,
  DoubleArrowLeftIcon,
  ExitIcon,
  HamburgerMenuIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { type users } from "~/server/db/schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { logout } from "~/server/actions/auth.actions";
import { TypographyP, TypographySmall } from "~/components/ui/typography";
import { Badge } from "~/components/ui/badge";

export default function SidebarWrapper({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: typeof users.$inferSelect;
}) {
  const sidebarRef = useRef<ImperativePanelHandle>(null);
  const currentSegment = usePathname().split("/").pop();

  const sidebarLinks = (
    <>
      <Link
        href={"/dashboard"}
        className={cn(
          buttonVariants({
            variant: currentSegment === "dashboard" ? "default" : "outline",
          }),
          "w-full justify-start space-x-3 border-none",
        )}
      >
        <DashboardIcon />
        <span>Dashboard</span>
      </Link>
      <Link
        href={"/dashboard/users"}
        className={cn(
          buttonVariants({
            variant: currentSegment === "users" ? "default" : "outline",
          }),
          "w-full justify-start space-x-3 border-none",
        )}
      >
        <PersonIcon />
        <span>Users</span>
      </Link>

      <div className="flex-grow" />
      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({
              variant: "outline",
            }),
            "w-full justify-start space-x-3 py-6",
          )}
        >
          <div>
            <Avatar className="h-[2rem] w-[2rem]">
              <AvatarImage src={currentUser.profilePicture ?? ""} />
              <AvatarFallback className="dark bg-primary">
                {currentUser.name
                  .split(" ")
                  .map((word) => word[0]?.toUpperCase())
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <span>{currentUser.name}</span>
        </PopoverTrigger>
        <PopoverContent className="dark">
          <TypographyP className="mb-3">
            <span className="flex items-center justify-between">
              {currentUser.name}
              <Badge className="uppercase">{currentUser.role}</Badge>
            </span>
            <TypographySmall>{currentUser.email}</TypographySmall>
          </TypographyP>
          <Button className="w-full" onClick={() => logout()}>
            Log Out
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );

  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        {/*for large screens*/}
        <ResizablePanel
          defaultSize={15}
          collapsedSize={4}
          minSize={4}
          collapsible={true}
          is="aside"
          className={`dark !min-w-[70px] bg-secondary text-secondary-foreground transition-all ease-out ${styles["sidebar-container"]} hidden  flex-col gap-3 p-3 lg:flex`}
          ref={sidebarRef}
        >
          <div className="flex items-center justify-between border-b border-secondary-foreground pb-3">
            <span className="w-[90%]">Dashboard</span>
            <Button
              onClick={(e) => {
                const element = e.target as HTMLElement;
                const child = element.children[0] as HTMLElement;

                const sidebar = sidebarRef.current;
                if (!sidebar) return;

                if (sidebar.isCollapsed()) {
                  sidebar.expand();
                  child.style.rotate = "0deg";
                } else {
                  sidebar.collapse();
                  child.style.rotate = "180deg";
                }
              }}
              size={"icon"}
              className="dark flex-grow"
              variant={"ghost"}
            >
              <DoubleArrowLeftIcon className="pointer-events-none transition-all duration-300" />
            </Button>
          </div>

          {sidebarLinks}
        </ResizablePanel>

        <ResizablePanel defaultSize={85} collapsible={false} is="main">
          <header className="dark flex items-center justify-between bg-secondary p-1 lg:hidden">
            {/*for small screens*/}
            <Sheet>
              <SheetTrigger
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                })}
              >
                <HamburgerMenuIcon className="text-white" />
              </SheetTrigger>
              <SheetContent
                is="aside"
                side={"left"}
                className="dark flex flex-col gap-3 bg-secondary text-secondary-foreground"
              >
                <SheetHeader>
                  <SheetTitle className="mb-5">Dashboard</SheetTitle>
                </SheetHeader>
                {sidebarLinks}
              </SheetContent>
            </Sheet>
          </header>

          <div className="p-5">{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
