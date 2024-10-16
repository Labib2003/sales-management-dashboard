"use client";

import { CopyIcon } from "@radix-ui/react-icons";
import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

const CopyButtonWrapper = ({
  children,
  disabled,
  className,
}: {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <span className={cn(className)}>
      {children}
      &nbsp;
      {!disabled && (
        <CopyIcon
          className="inline cursor-copy opacity-25"
          onClick={async (e) => {
            const el = e.target as HTMLButtonElement;
            el.classList.add("animate-ping");
            await window.navigator.clipboard.writeText(String(children));
            setTimeout(() => {
              el.classList.remove("animate-ping");
            }, 50);
          }}
        />
      )}{" "}
    </span>
  );
};

export default CopyButtonWrapper;
