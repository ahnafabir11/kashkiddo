import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropsWithChildren, Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import SideNavLinkSkeleton from "./side-nav-links-skeleton";
import SideNavLinks from "@/components/layout/side-nav-links";
import ActiveAccountCard from "@/components/active-account-card";
import ActiveAccountCardSkeleton from "./active-account-card-skeleton";

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

      <SheetContent side="left" className="flex flex-col p-4">
        <SheetHeader>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Wallet className="h-6 w-6" />
            <span>KashKiddo</span>
          </Link>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-auto">
          <Suspense fallback={<SideNavLinkSkeleton />}>
            <SideNavLinks />
          </Suspense>
        </div>

        <div className="mt-auto">
          <Suspense fallback={<ActiveAccountCardSkeleton />}>
            <ActiveAccountCard />
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  );
}
