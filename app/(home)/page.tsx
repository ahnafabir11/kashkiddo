import Header from "./header";
import HeroSection from "./hero-section";
import StatsSection from "./stats-section";

export default async function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <StatsSection />
    </main>
  );
}
