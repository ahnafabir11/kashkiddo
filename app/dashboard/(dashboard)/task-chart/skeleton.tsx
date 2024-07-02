import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TaskChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>Quick comparison of task stats</CardDescription>
      </CardHeader>

      <CardContent>
        <Skeleton className="w-full h-80" />
      </CardContent>
    </Card>
  );
}
