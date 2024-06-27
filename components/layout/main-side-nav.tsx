import Link from "next/link";
import { Wallet } from "lucide-react";
import ActiveAccountCard from "@/components/active-account-card";
import SideNavLinks from "@/components/layout/side-nav-links";

export default function MainSideNav() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex items-center h-14 border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <Wallet className="h-6 w-6" />
            <span>KashKiddo</span>
          </Link>
        </div>

        <div className="flex-1 overflow-auto">
          <SideNavLinks className="px-2 lg:px-4" />
        </div>

        <div className="mt-auto p-4">
          <ActiveAccountCard
            headerClassName="p-2 pt-0 md:p-4"
            contentClassName="p-2 pt-0 md:p-4 md:pt-0"
          />
        </div>
      </div>
    </div>
  );
}
