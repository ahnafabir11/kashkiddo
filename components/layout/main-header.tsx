import Link from "next/link";
import { Wallet } from "lucide-react";
import NavSheet from "@/components/layout/nav-sheet";
import HeaderDropdown from "@/components/layout/header-dropdown";

export default function MainHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <NavSheet className="md:hidden" />

      <div className="w-full flex-1">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 text-lg font-semibold md:hidden"
        >
          <Wallet className="h-6 w-6" />
          <span>KashKiddo</span>
        </Link>
      </div>

      <HeaderDropdown />
    </header>
  );
}
