import { Suspense } from "react";
import { auth } from "@/lib/auth";
import TaskChart from "./task-chart";
import { redirect } from "next/navigation";
import AnalyticCards from "./analytic-cards";
import EarningsChart from "./earnings-chart";
import TaskChartSkeleton from "./task-chart/skeleton";
import EarningsChartSkeleton from "./earnings-chart/skeleton";

export default async function Dashboard() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return redirect("/login");

  return (
    <main>
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-8">
        Dashboard
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <AnalyticCards userId={session.user.id} />
      </div>

      <div className="grid gap-x-4 gap-y-8 xl:grid-cols-2">
        <Suspense fallback={<TaskChartSkeleton />}>
          <TaskChart userId={session.user.id} />
        </Suspense>
        <Suspense fallback={<EarningsChartSkeleton />}>
          <EarningsChart userId={session.user.id} />
        </Suspense>
      </div>
    </main>
  );
}
