import Link from "next/link";
import { auth } from "@/lib/auth";
import NavSheet from "./nav-sheet";
import { Wallet } from "lucide-react";
import { redirect } from "next/navigation";
import HeaderDropdown from "./header-dropdown";
import ActiveAccountCard from "../active-account-card";
import prisma from "@/lib/db";

export default async function MainHeader() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <NavSheet className="md:hidden" role={session.user.role}>
        <ActiveAccountCard userId={session.user.id} />
      </NavSheet>

      <div className="w-full flex-1">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 text-lg font-semibold md:hidden"
        >
          <Wallet className="h-6 w-6" />
          <span>KashKiddo</span>
        </Link>
      </div>

      <HeaderDropdown
        balance={user?.balance || 0}
        email={user?.email || "username@gmail.com"}
      />
    </header>
  );
}
