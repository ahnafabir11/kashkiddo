import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EarningsChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings</CardTitle>
        <CardDescription>Quick comparison of earning stats</CardDescription>
      </CardHeader>

      <CardContent>
        <Skeleton className="w-full h-80" />
      </CardContent>
    </Card>
  );
}
