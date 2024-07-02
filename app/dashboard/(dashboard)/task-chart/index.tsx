import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import prisma from "@/lib/db";
import TaskChartClient from "./client";
import { startOfToday, startOfYesterday } from "date-fns";

export default async function TaskChart({ userId }: { userId: string }) {
  // Task Info (TODAY)
  const taskCountToday = await prisma.task.count({
    where: {
      deadline: startOfToday(),
    },
  });
  const submittedCountToday = await prisma.submittedTask.count({
    where: {
      userId,
      task: { deadline: startOfToday() },
    },
  });
  const approvedCountToday = await prisma.submittedTask.count({
    where: {
      userId,
      status: "COMPLETED",
      task: { deadline: startOfToday() },
    },
  });

  // Task Info (YESTERDAY)
  const taskCountYesterday = await prisma.task.count({
    where: {
      deadline: startOfYesterday(),
    },
  });
  const submittedCountYesterday = await prisma.submittedTask.count({
    where: {
      userId,
      task: { deadline: startOfYesterday() },
    },
  });
  const approvedCountYesterday = await prisma.submittedTask.count({
    where: {
      userId,
      status: "COMPLETED",
      task: { deadline: startOfYesterday() },
    },
  });

  // Chart Data
  const data = [
    {
      name: "Today",
      "Total Task": taskCountToday,
      "Submitted Task": submittedCountToday,
      "Approved Task": approvedCountToday,
    },
    {
      name: "Yesterday",
      "Total Task": taskCountYesterday,
      "Submitted Task": submittedCountYesterday,
      "Approved Task": approvedCountYesterday,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>Quick comparison of task stats</CardDescription>
      </CardHeader>

      <CardContent>
        <TaskChartClient data={data} />
      </CardContent>
    </Card>
  );
}
