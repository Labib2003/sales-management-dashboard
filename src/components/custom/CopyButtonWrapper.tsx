"use client";

import { CopyIcon } from "@radix-ui/react-icons";
import { type ReactNode } from "react";

const CopyButtonWrapper = ({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) => {
  return (
    <span className="flex items-center gap-1">
      {children}
      {!disabled && (
        <CopyIcon
          className="cursor-copy opacity-25"
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
