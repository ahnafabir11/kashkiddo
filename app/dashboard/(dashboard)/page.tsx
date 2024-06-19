import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { CalendarDateRangePicker } from "./date-range-picker";
import { Button } from "@/components/ui/button";
import AnalyticsCard from "@/components/analytics-card";
import { DollarSign, ClipboardCheck, Handshake } from "lucide-react";
import { redirect } from "next/navigation";
import { startOfToday, endOfToday } from "date-fns";

export default async function Dashboard() {
  const session = await auth();

  if (!session || !session.user) redirect("/login");

  const taskCount = await prisma.task.count({
    where: { deadline: startOfToday() },
  });

  const submissionCount = await prisma.submittedTask.count({
    where: {
      userId: session.user.id,
      task: { deadline: startOfToday() },
    },
  });

  const earnings = await prisma.tansaction.findMany({
    where: {
      type: "INCOME",
      userId: session.user.id,
      createdAt: { gte: startOfToday(), lte: endOfToday() },
    },
  });

  const earningCount = earnings.reduce((total, item) => total + item.amount, 0);

  const referCount = await prisma.referral.count({
    where: { referredById: session.user.id },
  });

  return (
    <main>
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-2 mb-4">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Dashboard
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <CalendarDateRangePicker />
          <Button className="w-full sm:w-auto">Download</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <AnalyticsCard
          label="Task Submitted"
          Icon={ClipboardCheck}
          amount={`${submissionCount}/${taskCount}`}
          description="Task Submitted today"
          className="flex-1"
        />
        <AnalyticsCard
          label="Earnings"
          Icon={DollarSign}
          amount={earningCount}
          description="Earnings today"
          className="flex-1"
        />
        <AnalyticsCard
          label="Total Referrals"
          Icon={Handshake}
          amount={referCount}
          description="Total lifetime referrals"
          className="flex-1"
        />
      </div>
    </main>
  );
}
