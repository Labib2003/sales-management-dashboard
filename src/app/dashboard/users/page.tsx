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
import UpdateUserRoleModal from "./UpdateUserRoleModal";
import UserDetailsModal from "./UserDetailsModal";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { getCurrentUser } from "~/server/actions/auth.actions";
import { type smd_User, type smd_Role } from "@prisma/client";
import { redirect } from "next/navigation";

const UsersTable = async ({
  searchParams,
  currentUser,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
  };
  currentUser?: smd_User;
}) => {
  const { total, data: users } = await getUsers({
    page: parseInt(searchParams?.page ?? "1"),
    limit: parseInt(searchParams?.limit ?? "10"),
    search: searchParams?.search,
    role: searchParams?.role,
  });
  return (
    <>
      <main>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Sales This Week</TableHead>
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
                <TableCell>{user._count.sales}</TableCell>
                <TableCell className="space-x-2 text-center">
                  <UserDetailsModal userData={user} />
                  {(["superadmin", "admin"] as smd_Role[]).includes(
                    currentUser?.role ?? "guest",
                  ) && (
                    <>
                      <UpdateUserRoleModal user={user} />
                      <DeleteUserModal userId={user.id} />
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>

      <footer className="pt-5">
        <HandlePagination total={total} />
      </footer>
    </>
  );
};

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
  // only admins can access this page
  const currentUser = await getCurrentUser();
  if (
    !(["superadmin", "admin"] as smd_Role[]).includes(
      currentUser?.role ?? "guest",
    )
  )
    redirect("/dashboard");

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
          {(["superadmin", "admin"] as smd_Role[]).includes(
            currentUser?.role ?? "guest",
          ) && <CreateUserModal />}
        </div>
      </header>

      <Suspense
        fallback={
          <div className="space-y-2">
            <Skeleton className="h-[40px]" />
            <Skeleton className="h-[40px]" />
            <Skeleton className="h-[40px]" />
          </div>
        }
      >
        <UsersTable
          searchParams={searchParams}
          currentUser={currentUser ?? undefined}
        />
      </Suspense>
    </div>
  );
}
