"use client";

import Link from "next/link";
import { Role } from "@prisma/client";
import { usePathname } from "next/navigation";
import { cn, getNavLinks } from "@/lib/utils";

interface SideNavLinksClientProps {
  role: Role;
  className?: string;
}

export default function SideNavLinksClient({
  role,
  className,
}: SideNavLinksClientProps) {
  const pathname = usePathname();
  const navLinks = getNavLinks(role);

  return (
    <nav className={cn("grid text-sm font-medium", className)}>
      {navLinks.map((link) => {
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all overflow-hidden hover:text-primary",
              { "bg-muted text-primary": link.href === pathname }
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
