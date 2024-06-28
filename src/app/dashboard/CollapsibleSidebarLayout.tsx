"use client";

import { useRef } from "react";
import { type ImperativePanelHandle } from "react-resizable-panels";
import { Button, buttonVariants } from "~/components/ui/button";
import { ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import styles from "./dashboard.module.css";
import {
  DashboardIcon,
  DoubleArrowLeftIcon,
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

export default function CollapsibleSidebarLayout({
  children,
}: {
  children: React.ReactNode;
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
          "w-full justify-start space-x-3",
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
          "w-full justify-start space-x-3",
        )}
      >
        <PersonIcon />
        <span>Users</span>
      </Link>
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
          className={`dark !min-w-[70px] bg-secondary text-secondary-foreground transition-all ease-out ${styles["sidebar-container"]} hidden space-y-3 p-3 lg:block`}
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
                className="dark bg-secondary text-secondary-foreground"
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
