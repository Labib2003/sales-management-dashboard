"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const HandleSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function debounce(fn: () => void, delay: number) {
    let timer;
    return (() => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(), delay);
    })();
  }

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("search", term);
    } else params.delete("search");
    debounce(() => router.replace(`${pathname}?${params.toString()}`), 100);
  }

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
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default HandleSearch;
