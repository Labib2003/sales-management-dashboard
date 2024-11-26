import { DollarSignIcon, PackageIcon, WarehouseIcon } from "lucide-react";
import { Suspense, type ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  TypographyH3,
  TypographyH4,
  TypographyLead,
} from "~/components/ui/typography";
import { getDashboardStats } from "~/server/queries/dashboard.queries";

const StatCard = ({
  icon,
  value,
  description,
}: {
  icon: ReactNode;
  value: string;
  description: string;
}) => {
  return (
    <Card className="transition-all hover:shadow-lg hover:shadow-black/25">
      <CardContent className="flex items-center gap-5 pt-5">
        <div className="max-w-fit rounded-full bg-primary/50 p-5">{icon}</div>

        <div>
          <TypographyLead>{value}</TypographyLead>
          <TypographyH4>{description}</TypographyH4>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardStats = async () => {
  const stats = await getDashboardStats();
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<WarehouseIcon size={32} stroke="white" />}
        value={stats.totalVendors + ""}
        description="Active Vendors"
      />
      <StatCard
        icon={<PackageIcon size={32} stroke="white" />}
        value={stats.totalProducts + ""}
        description="Active Products"
      />
      <StatCard
        icon={<DollarSignIcon size={32} stroke="white" />}
        value={"$" + stats.totalRevenue / 100 + ""}
        description="Total Revenue"
      />
      <StatCard
        icon={<DollarSignIcon size={32} stroke="white" />}
        value={"$" + stats.revenueThisWeek / 100}
        description="Revenue This Week"
      />
    </section>
  );
};

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  return (
    <div>
      <header className="mb-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <TypographyH3>Dashboard</TypographyH3>
      </header>

      <main>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-[100px]" />
              <Skeleton className="h-[100px]" />
              <Skeleton className="h-[100px]" />
              <Skeleton className="h-[100px]" />
            </div>
          }
        >
          <DashboardStats />
        </Suspense>
      </main>
    </div>
  );
}
