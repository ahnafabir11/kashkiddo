import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import SideNavLinksClient from "./side-nav-links-client";

interface SideNavLinks {
  className?: string;
}

export default async function SideNavLinks({ className }: SideNavLinks) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return null;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return null;

  return <SideNavLinksClient role={user.role} className={className} />;
}
