import { Wallet } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ActiveAccountCard from "../active-account-card";
import SideNavLinks from "./side-nav-links";
import { auth } from "@/lib/auth";

export default async function MainSideNav() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) redirect("/login");

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

        <SideNavLinks role={session.user.role} />

        <div className="mt-auto p-4">
          <ActiveAccountCard
            userId={session.user.id}
            headerClassName="p-2 pt-0 md:p-4"
            contentClassName="p-2 pt-0 md:p-4 md:pt-0"
          />
        </div>
      </div>
    </div>
  );
}
