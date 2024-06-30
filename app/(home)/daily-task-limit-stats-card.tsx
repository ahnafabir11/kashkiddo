import NumberTicker from "@/components/magicui/number-ticker";
import { StatsCard, StatsCardTitle, StatsText } from "./stats-card";

export default function DailyTaskLimitStatsCard() {
  return (
    <StatsCard>
      <StatsCardTitle>Daily Task Limit</StatsCardTitle>
      <StatsText>
        <NumberTicker value={2} />
      </StatsText>
    </StatsCard>
  );
}
