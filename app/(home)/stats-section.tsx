import prisma from "@/lib/db";
import NumberTicker from "@/components/magicui/number-ticker";
import LetterPullup from "@/components/magicui/letter-pullup";

export default async function StatsSection() {
  const fakeUserCount = await prisma.user.count();
  const userCount = fakeUserCount < 1000 ? fakeUserCount + 1000 : fakeUserCount;

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
            <div className="flex flex-col rounded-lg bg-primary-foreground px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-secondary-foreground">
                Total Users
              </dt>

              <dd className="text-4xl font-extrabold text-primary md:text-5xl">
                <NumberTicker value={userCount} />
              </dd>
            </div>

            <div className="flex flex-col rounded-lg bg-primary-foreground px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-secondary-foreground">
                Daily Income limit
              </dt>

              <dd className="text-4xl font-extrabold text-primary md:text-5xl uppercase">
                <LetterPullup words={"unlimited"} />
              </dd>
            </div>

            <div className="flex flex-col rounded-lg bg-primary-foreground px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-secondary-foreground">
                Daily Tasks
              </dt>

              <dd className="text-4xl font-extrabold text-primary md:text-5xl">
                <NumberTicker value={2} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
