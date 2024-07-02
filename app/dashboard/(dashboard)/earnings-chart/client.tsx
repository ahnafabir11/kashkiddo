import { BarChart } from "@/components/charts/bar-chart";

interface EarningsChartClientProps {
  data: Record<string, any>[];
}

export default function EarningsChartClient({
  data,
}: EarningsChartClientProps) {
  return (
    <BarChart
      data={data}
      index="name"
      enableLegendSlider
      yAxisLabel="Earnings (Taka)"
      categories={["Task", "Refer"]}
    />
  );
}
