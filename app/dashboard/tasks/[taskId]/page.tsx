import CopyToClipboardButton from "@/components/copy-to-clipboard-button";
import SubmitTaskDialog from "@/components/submit-task-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/db";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import TaskActionDropdown from "./task-action-dropdown";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { auth } from "@/lib/auth";
import TaskSubmission from "./task-submission";
import TaskSubmissionAlert from "./task-submission-alert";

export default async function page({ params }: { params: { taskId: string } }) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  const task = await prisma.task.findUnique({ where: { id: params.taskId } });
  if (!task) notFound();

  const submission = await prisma.submittedTask.findFirst({
    where: { taskId: task.id, userId: session.user.id },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between gap-2">
        <Button variant="link" asChild className="p-0 text-muted-foreground">
          <Link href="/dashboard/tasks">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>

        {session.user.role === "ADMIN" && (
          <TaskActionDropdown taskId={task.id} className="shrink-0" />
        )}
      </div>

      <AspectRatio ratio={3 / 1} className="bg-muted relative">
        <Image
          fill
          src={task.cover ?? "/images/task-cover.jpeg"}
          alt="Photo by Drew Beamer"
          className="rounded-md object-cover"
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

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {task.title}
      </h3>

      <p className="leading-7 [&:not(:first-child)]:mt-6 whitespace-pre-wrap">
        {task.description}
      </p>

      <div className="flex items-center gap-2">
        <Input value={task.url} readOnly />
        <CopyToClipboardButton
          tooltip="URL"
          text={task.url}
          className="shrink-0"
        />
      </div>

      {!user?.active ? (
        <TaskSubmissionAlert />
      ) : submission ? (
        <TaskSubmission
          description={submission.description}
          screenshots={submission.screenshots}
        />
      ) : (
        <SubmitTaskDialog
          taskId={task.id}
          userId={user.id || ""}
          className="w-full sm:w-auto"
        />
      )}
    </div>
  );
}
