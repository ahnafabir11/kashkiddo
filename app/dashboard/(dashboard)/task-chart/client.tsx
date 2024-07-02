"use client";

import { BarChart } from "@/components/charts/bar-chart";

interface TaskChartClientProps {
  data: Record<string, any>[];
}

export default function TaskChartClient({ data }: TaskChartClientProps) {
  return (
    <BarChart
      data={data}
      index="name"
      enableLegendSlider
      yAxisLabel="Number of Tasks"
      categories={["Total Task", "Submitted Task", "Approved Task"]}
    />
  );
}
