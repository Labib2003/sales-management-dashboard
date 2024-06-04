"use client";

import { useRef } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { Button } from "~/components/ui/button";
import { ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import styles from "./dashboard.module.css";
import { DashboardIcon, DoubleArrowLeftIcon } from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

const sidebarLinks = (
  <>
    <Button className="w-full justify-start space-x-3">
      <DashboardIcon />
      <span>Dashboard</span>
    </Button>
  </>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarRef = useRef<ImperativePanelHandle>(null);

  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        {/*for large screens*/}
        <ResizablePanel
          defaultSize={15}
          collapsedSize={3}
          minSize={3}
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

        {/*for small screens*/}
        <Sheet>
          <SheetTrigger className="block lg:hidden">Open</SheetTrigger>
          <SheetContent is="aside" side={"left"} className="dark bg-secondary">
            <SheetHeader>
              <SheetTitle className="mb-5">Dashboard</SheetTitle>
            </SheetHeader>
            {sidebarLinks}
          </SheetContent>
        </Sheet>

        <ResizablePanel defaultSize={85} collapsible={false} is="main">
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
