import { getCurrentUser, logout } from "~/server/actions/auth.actions";
import Sidebar from "./SidebarWrapper";
import { RedirectType, redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/auth/login", RedirectType.replace);
  if (currentUser.role === "guest") await logout();

  return <Sidebar currentUser={currentUser}>{children}</Sidebar>;
}
