import { cn } from "@/lib/utils";
import { Calendar, Coins } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

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
            variant={submission.status === "PENDING" ? "secondary" : "default"}
          >
            {submission.status}
          </Badge>
        )}
      </AspectRatio>

      <CardHeader>
        <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
        <CardDescription className="text-xs line-clamp-2 min-h-8">
          {description}
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
              {deadline.toLocaleDateString()}
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
