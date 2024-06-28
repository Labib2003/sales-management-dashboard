import { validateRequest } from "~/lib/validateRequest";
import CollapsibleSidebarLayout from "./CollapsibleSidebarLayout";
import { RedirectType, redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: currentUser } = await validateRequest();
  if (!currentUser) redirect("/auth/login", RedirectType.replace);

  return <CollapsibleSidebarLayout>{children}</CollapsibleSidebarLayout>;
}
