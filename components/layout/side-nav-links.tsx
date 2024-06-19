"use client";
import { cn, getNavLinks } from "@/lib/utils";
import { Role } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideNavLinksProps {
  role: Role;
  className?: string;
}

export default function SideNavLinks({ role, className }: SideNavLinksProps) {
  const pathname = usePathname();
  const navLinks = getNavLinks(role);

  return (
    <div className={cn("flex-1 overflow-auto", className)}>
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
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
    </div>
  );
}
