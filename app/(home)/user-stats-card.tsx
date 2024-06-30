import prisma from "@/lib/db";
import NumberTicker from "@/components/magicui/number-ticker";
import { StatsCard, StatsCardTitle, StatsText } from "./stats-card";

export default async function UserStatsCard() {
  const fakeUserCount = await prisma.user.count();
  const userCount = fakeUserCount < 1000 ? fakeUserCount + 1000 : fakeUserCount;

  return (
    <StatsCard>
      <StatsCardTitle>Total Users</StatsCardTitle>
      <StatsText>
        <NumberTicker value={userCount} />
      </StatsText>
    </StatsCard>
  );
}
