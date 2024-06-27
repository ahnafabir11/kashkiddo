import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "./ui/card";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import ActiveAccountDialog from "./active-account-dialog";

interface ActiveAccountCardProps {
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export default async function ActiveAccountCard({
  className,
  headerClassName,
  contentClassName,
}: ActiveAccountCardProps) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return null;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const request = await prisma.activation.findUnique({
    where: { userId: session.user.id },
  });

  if (user?.active) return null;

  return (
    <Card className={className}>
      <CardHeader className={headerClassName}>
        <CardTitle>Active Account</CardTitle>
        <CardDescription>
          Unlock all features and get unlimited access to our support team.
        </CardDescription>
      </CardHeader>

      <CardContent className={contentClassName}>
        <ActiveAccountDialog submitted={!!request?.id || false} />
      </CardContent>
    </Card>
  );
}
