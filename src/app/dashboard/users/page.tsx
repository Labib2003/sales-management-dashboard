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
import { db } from "~/server/db";
import DeleteUserModal from "./DeleteUserModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import CreateUserModal from "./CreateUserModal";

export const dynamic = "force-dynamic";

export default async function Users() {
  const users = await db.query.users.findMany();

  return (
    <div>
      <header className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <TypographyH3>User/Employee List</TypographyH3>
        </div>

        <div>
          <CreateUserModal />
        </div>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
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
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell className="capitalize">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone ?? "N/A"}</TableCell>
              <TableCell className="uppercase">{user.role}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="max-w-[12ch] truncate">
                        {user.address ?? "N/A"}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="w-[500px] bg-card text-foreground shadow-md">
                      <p>{user.address}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-center">
                <DeleteUserModal userId={user.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
