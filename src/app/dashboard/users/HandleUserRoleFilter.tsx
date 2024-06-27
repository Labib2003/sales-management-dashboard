"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { userRoles } from "~/constants";

const HandleUserRoleFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleFilter(role: string) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (role === "all") params.delete("role");
    else params.set("role", role);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Select
      onValueChange={handleFilter}
      defaultValue={searchParams.get("role") ?? ""}
    >
      <SelectTrigger>
        <SelectValue placeholder="Filter by role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"all"}>all</SelectItem>
        {userRoles.map((role) => (
          <SelectItem key={role} value={role}>
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default HandleUserRoleFilter;
