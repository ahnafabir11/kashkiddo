import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import ThemeDropdownMenuItem from "./theme-dropdown-menu-item";
import LogoutDropdownMenuItem from "./logout-dropdown-menu-item";
import { CircleUser, Info, LogOut, Settings, User } from "lucide-react";

export default async function HeaderDropdown() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return null;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.balance} TK
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          Profile
          <DropdownMenuShortcut>
            <User className="h-4 w-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Settings
          <DropdownMenuShortcut>
            <Settings className="h-4 w-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="https://t.me/KashKiddo1" target="_blank">
            Support
            <DropdownMenuShortcut>
              <Info className="h-4 w-4" />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <ThemeDropdownMenuItem>Theme</ThemeDropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutDropdownMenuItem>
          Logout
          <DropdownMenuShortcut>
            <LogOut className="h-4 w-4" />
          </DropdownMenuShortcut>
        </LogoutDropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
