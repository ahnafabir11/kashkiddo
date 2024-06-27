import Link from "next/link";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { Menu, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import SideNavLinks from "@/components/layout/side-nav-links";
import ActiveAccountCard from "@/components/active-account-card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavSheetProps extends PropsWithChildren {
  className?: string;
}

export default function NavSheet({ className }: NavSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={cn("shrink-0", className)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold mb-8"
        >
          <Wallet className="h-6 w-6" />
          <span>KashKiddo</span>
        </Link>

        <div className="flex-1 overflow-auto">
          <SideNavLinks />
        </div>

        <div className="mt-auto">
          <ActiveAccountCard />
        </div>
      </SheetContent>
    </Sheet>
  );
}
