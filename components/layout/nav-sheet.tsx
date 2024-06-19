"use client";
import Link from "next/link";
import { Role } from "@prisma/client";
import { PropsWithChildren } from "react";
import { Menu, Wallet } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn, getNavLinks } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavSheetProps extends PropsWithChildren {
  role: Role;
  className?: string;
}

export default function NavSheet({ role, className, children }: NavSheetProps) {
  const pathname = usePathname();
  const navLinks = getNavLinks(role);

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
          <nav className="grid gap-2 text-lg font-medium overflow-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground overflow-hidden hover:text-foreground shrink-0",
                    { "bg-muted text-foreground": link.href === pathname }
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
