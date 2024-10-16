import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TypographyH3 } from "~/components/ui/typography";
import DeleteUserModal from "./DeleteUserModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import CreateUserModal from "./CreateUserModal";
import { getUsers } from "~/server/queries/user.queries";
import HandlePagination from "~/components/custom/HandlePagination";
import HandleSearch from "~/components/custom/HandleSearch";
import HandleUserRoleFilter from "./HandleUserRoleFilter";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import UpdateUserRoleModal from "./UpdateUserRoleModal";
import { EyeIcon } from "lucide-react";

export default async function Users({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
  };
}) {
  const { total, data: users } = await getUsers({
    page: parseInt(searchParams?.page ?? "1"),
    limit: parseInt(searchParams?.limit ?? "10"),
    search: searchParams?.search,
    role: searchParams?.role,
  });

  return (
    <div>
      <header className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <TypographyH3>User/Employee List</TypographyH3>
        </div>

        <div className="flex gap-2">
          <div className="grid grid-cols-2 gap-2">
            <HandleUserRoleFilter />
            <HandleSearch />
          </div>
          <CreateUserModal />
        </div>
      </header>

      <main>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="capitalize">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone ?? "N/A"}</TableCell>
                <TableCell className="uppercase">{user.role}</TableCell>
                <TableCell>
                  {user.address ? (
                    user.address.length > 10 ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="max-w-[12ch] truncate">
                              {user.address}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent className="w-[500px] bg-card text-foreground shadow-md">
                            <p>{user.address}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      user.address
                    )
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="space-x-2 text-center">
                  <Link
                    href={`/dashboard/users/${user.id}`}
                    className={buttonVariants({
                      size: "icon",
                      variant: "outline",
                      className: "hover:text-white",
                    })}
                  >
                    <EyeIcon />
                  </Link>
                  <UpdateUserRoleModal user={user} />
                  <DeleteUserModal userId={user.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>

      <footer className="pt-5">
        <HandlePagination total={total} />
      </footer>
    </div>
  );
}
