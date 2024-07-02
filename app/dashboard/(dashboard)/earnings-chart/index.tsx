import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  endOfToday,
  startOfToday,
  endOfYesterday,
  startOfYesterday,
} from "date-fns";
import prisma from "@/lib/db";
import EarningsChartClient from "./client";

export default async function EarningsChart({ userId }: { userId: string }) {
  // Earnings Info (TODAY)
  const earningsToday = await prisma.tansaction.findMany({
    where: {
      userId,
      type: "INCOME",
      createdAt: { gte: startOfToday(), lte: endOfToday() },
    },
  });

  const earningsDataToday = earningsToday.reduce(
    (acc, curr) => {
      if (curr.reason === "TASK") {
        acc.Task += curr.amount;
      } else if (curr.reason === "REFERRAL") {
        acc.Refer += curr.amount;
      }
      return acc;
    },
    { name: "Today", Task: 0, Refer: 0 }
  );

  // Earnings Info (Yesterday)
  const earningsYesterday = await prisma.tansaction.findMany({
    where: {
      userId,
      type: "INCOME",
      createdAt: { gte: startOfYesterday(), lte: endOfYesterday() },
    },
  });

  const earningsDataYesterday = earningsYesterday.reduce(
    (acc, curr) => {
      if (curr.reason === "TASK") {
        acc.Task += curr.amount;
      } else if (curr.reason === "REFERRAL") {
        acc.Refer += curr.amount;
      }
      return acc;
    },
    { name: "Yesterday", Task: 0, Refer: 0 }
  );

  // Chart Data
  const data = [earningsDataToday, earningsDataYesterday];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings</CardTitle>
        <CardDescription>Quick comparison of earning stats</CardDescription>
      </CardHeader>

      <CardContent>
        <EarningsChartClient data={data} />
      </CardContent>
    </Card>
  );
}
