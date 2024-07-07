import { getCurrentUser } from "~/server/actions/auth.actions";
import SidebarWrapper from "./SidebarWrapper";
import { RedirectType, redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/auth/login", RedirectType.replace);

  return <SidebarWrapper currentUser={currentUser}>{children}</SidebarWrapper>;
}
