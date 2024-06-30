import LetterPullup from "@/components/magicui/letter-pullup";
import { StatsCard, StatsCardTitle, StatsText } from "./stats-card";

export default function DailyIncomeLimitStatsCard() {
  return (
    <StatsCard>
      <StatsCardTitle>Daily Income limit</StatsCardTitle>
      <StatsText className="uppercase">
        <LetterPullup words={"unlimited"} />
      </StatsText>
    </StatsCard>
  );
}
