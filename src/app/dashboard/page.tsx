import { DollarSignIcon, PackageIcon, WarehouseIcon } from "lucide-react";
import { type ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Card, CardContent } from "~/components/ui/card";
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
    <Card>
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

export default async function Dashboard() {
  const stats = await getDashboardStats();
  return (
    <div>
      <header className="mb-8">
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
        <section className="grid grid-cols-4 gap-5">
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
            description="Active Vendors"
          />
        </section>
      </main>
    </div>
  );
}
