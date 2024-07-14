import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import prisma from "@/lib/db";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { cn, removeTags } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  amount: number;
  cover: null | string;
  className?: string;
  deadline: Date;
}

export default async function TaskCard({
  id,
  title,
  cover,
  amount,
  deadline,
  className,
  description,
}: TaskCardProps) {
  const session = await auth();
  if (!session || !session.user) redirect("/login");

  const submission = await prisma.submittedTask.findFirst({
    where: { taskId: id, userId: session.user.id },
  });

  return (
    <Card className={cn("@container", className)}>
      <AspectRatio ratio={3 / 1} className="bg-muted relative">
        <Image
          fill
          src={cover ?? "/images/task-cover.jpeg"}
          alt="Photo by Drew Beamer"
          className="rounded-md object-cover rounded-b-none"
        />

        {submission && (
          <Badge
            className="absolute right-2 top-2"
            variant={
              submission.status === "PENDING"
                ? "secondary"
                : submission.status === "REJECTED"
                ? "destructive"
                : "default"
            }
          >
            {submission.status}
          </Badge>
        )}
      </AspectRatio>

      <CardHeader>
        <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
        <CardDescription className="text-xs line-clamp-2 min-h-8">
          {removeTags(description)}
        </CardDescription>
      </CardHeader>

      <CardFooter className="block">
        <div className="flex items-center justify-between gap-2">
          <div className="@xs:flex gap-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Coins className="mr-1 h-4 w-4" />
              {amount}TK
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              {format(deadline, "dd/MM/yyyy")}
            </div>
          </div>

          <Button size="sm" variant="outline" asChild>
            <Link href={`/dashboard/tasks/${id}`}>See Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
