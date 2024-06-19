import { PropsWithChildren } from "react";
import MainHeader from "@/components/layout/main-header";
import MainSideNav from "@/components/layout/main-side-nav";

export default async function layout({ children }: PropsWithChildren) {
  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <MainSideNav />

      <div className="flex flex-col overflow-hidden">
        <MainHeader />

        <div className="flex-1 p-4 lg:p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
