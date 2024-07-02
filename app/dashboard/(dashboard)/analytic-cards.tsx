import prisma from "@/lib/db";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { startOfToday, endOfToday } from "date-fns";
import AnalyticsCard from "@/components/analytics-card";
import { DollarSign, ClipboardCheck, Handshake } from "lucide-react";

interface AnalyticCardsProps {
  userId: string;
}

export default async function AnalyticCards({ userId }: AnalyticCardsProps) {
  return (
    <>
      <AnalyticsCard
        label="Task Submitted"
        Icon={ClipboardCheck}
        description="Task Submitted today"
        amount={
          <Suspense fallback={<AmountSkeleton />}>
            <TaskAmount userId={userId} />
          </Suspense>
        }
      />
      <AnalyticsCard
        label="Earnings"
        Icon={DollarSign}
        description="Total earnings today"
        amount={
          <Suspense fallback={<AmountSkeleton />}>
            <EarningsAmount userId={userId} />
          </Suspense>
        }
      />
      <AnalyticsCard
        label="Referrals"
        Icon={Handshake}
        description="Total referrals today"
        amount={
          <Suspense fallback={<AmountSkeleton />}>
            <ReferAmount userId={userId} />
          </Suspense>
        }
      />
    </>
  );
}

function AmountSkeleton() {
  return <Skeleton className="w-20 h-8" />;
}

async function TaskAmount({ userId }: { userId: string }) {
  const taskCount = await prisma.task.count({
    where: { deadline: startOfToday() },
  });

  const submissionCount = await prisma.submittedTask.count({
    where: {
      userId,
      task: { deadline: startOfToday() },
    },
  });

  return `${submissionCount}/${taskCount}`;
}

async function EarningsAmount({ userId }: { userId: string }) {
  const earnings = await prisma.tansaction.findMany({
    where: {
      userId,
      type: "INCOME",
      createdAt: { gte: startOfToday(), lte: endOfToday() },
    },
  });

  const earningCount = earnings.reduce((total, item) => total + item.amount, 0);

  return earningCount;
}

async function ReferAmount({ userId }: { userId: string }) {
  const referCount = await prisma.referral.count({
    where: {
      referredById: userId,
      createdAt: { gte: startOfToday(), lte: endOfToday() },
    },
  });

  return referCount;
}
