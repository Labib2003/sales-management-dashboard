"use client";

import { type smd_InvoiceItem, type smd_ProductPrice } from "@prisma/client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";

const chartConfig = {
  packagePrice: {
    label: "Package Price: ",
    color: "hsl(var(--chart-2))",
  },
  unitPrice: {
    label: "Unit Price: ",
    color: "hsl(var(--chart-2))",
  },
  packageSold: {
    label: "Package Sold: ",
    color: "hsl(var(--chart-5))",
  },
  unitSold: {
    label: "Unit Sold: ",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const PriceHistoryChart = ({
  history,
}: {
  history: (smd_ProductPrice & { invoice_history: smd_InvoiceItem[] })[];
}) => {
  const data = history.map((price) => ({
    date: new Date(price.created_at).toLocaleDateString(),
    packagePrice: price.package_price / 100,
    unitPrice: price.unit_price ? price.unit_price / 100 : null,
    packageSold: price.invoice_history.reduce(
      (acc, curr) => (acc += curr.package_quantity),
      0,
    ),
    unitSold: price.invoice_history.reduce(
      (acc, curr) => (acc += curr.unit_quantity),
      0,
    ),
  }));
  for (let i = 0; i < 10 - history.length; i++)
    data.push({
      date: "",
      packagePrice: 0,
      unitPrice: 0,
      packageSold: 0,
      unitSold: 0,
    });

  return (
    <Card className="shadow-black/30">
      <CardHeader>
        <CardTitle>Price History and Its Relation to Sales</CardTitle>
        <CardDescription>(Latest 10 Entries)</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <ChartContainer
          config={chartConfig}
          className="h-[300px] w-full min-w-[600px]"
        >
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />

            <Bar
              dataKey="packagePrice"
              fill="var(--color-packagePrice)"
              radius={4}
            />
            <Bar dataKey="unitPrice" fill="var(--color-unitPrice)" radius={4} />
            <Bar
              dataKey="packageSold"
              fill="var(--color-packageSold)"
              radius={4}
            />
            <Bar dataKey="unitSold" fill="var(--color-unitSold)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PriceHistoryChart;
