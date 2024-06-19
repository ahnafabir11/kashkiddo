import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Elevate Your Earnings.{" "}
            <strong className="font-extrabold text-primary sm:block">
              Live Financially Free.
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Unlock the best income opportunities and take control of your
            financial destiny. Begin your journey to financial freedom now.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard">Get Started</Link>
            </Button>

            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/dashboard">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
