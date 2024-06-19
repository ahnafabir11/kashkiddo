import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "./ui/card";
import prisma from "@/lib/db";
import ActiveAccountDialog from "./active-account-dialog";

interface ActiveAccountCardProps {
  userId: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export default async function ActiveAccountCard({
  userId,
  className,
  headerClassName,
  contentClassName,
}: ActiveAccountCardProps) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const request = await prisma.activation.findUnique({ where: { userId } });

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
        <ActiveAccountDialog
          userId={user?.id || ""}
          submitted={!!request?.id || false}
        />
      </CardContent>
    </Card>
  );
}
