import { Suspense } from "react";
import UserStatsCard from "./user-stats-card";
import StatsCardSkeleton from "./stats-card-skeleton";
import DailyTaskLimitStatsCard from "./daily-task-limit-stats-card";
import DailyIncomeLimitStatsCard from "./daily-income-limit-stats-card";

export default function StatsSection() {
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Trusted by Many Freelancers
          </h2>

          <p className="mt-4 text-sm sm:text-xl">
            Freelancers trust our platform for secure, high-quality earning
            opportunities and career growth. Join thousands of freelancers who
            trust us to boost their income and grow their careers.
          </p>
        </div>

        <div className="mt-8 sm:mt-12">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Suspense fallback={<StatsCardSkeleton />}>
              <UserStatsCard />
            </Suspense>
            <DailyIncomeLimitStatsCard />
            <DailyTaskLimitStatsCard />
          </dl>
        </div>
      </div>
    </section>
  );
}
