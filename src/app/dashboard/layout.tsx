"use client";

import { useRef } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { Button } from "~/components/ui/button";
import { ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import styles from "./dashboard.module.css";
import { DashboardIcon } from "@radix-ui/react-icons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarRef = useRef<ImperativePanelHandle>(null);

  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        <ResizablePanel
          defaultSize={15}
          collapsedSize={3}
          collapsible={true}
          is="aside"
          className={`dark !min-w-[70px] bg-secondary text-secondary-foreground transition-all ease-out ${styles["sidebar-container"]} space-y-3 p-3`}
          ref={sidebarRef}
        >
          <div>
            <span>This is </span>
            Sidebar
          </div>
          <Button className="w-full justify-start space-x-3">
            <DashboardIcon />
            <span>Dashboard</span>
          </Button>
        </ResizablePanel>

        <ResizablePanel defaultSize={85} collapsible={false} is="main">
          <Button
            onClick={() => {
              const sidebar = sidebarRef.current;
              if (!sidebar) return;

              if (sidebar.isCollapsed()) sidebar.expand();
              else sidebar.collapse();
            }}
          >
            Collapse Sidebar
          </Button>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
