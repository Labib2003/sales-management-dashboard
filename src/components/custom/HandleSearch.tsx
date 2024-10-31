"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const HandleSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (searchTerm) {
      params.set("page", "1");
      params.set("search", searchTerm);
    } else params.delete("search");

    const x = setTimeout(
      () => router.replace(`${pathname}?${params.toString()}`),
      500,
    );

    return () => clearTimeout(x);
  }, [searchTerm, pathname, router, searchParams]);

  return (
    <div className="relative">
      <MagnifyingGlassIcon
        className="absolute top-1/2 ms-2 -translate-y-1/2 opacity-50"
        width={20}
        height={20}
      />
      <Input
        className="ps-8"
        placeholder="Search"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default HandleSearch;
