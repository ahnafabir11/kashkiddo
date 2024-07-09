import Link from "next/link";
import prisma from "@/lib/db";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import TaskSubmission from "./task-submission";
import { Button } from "@/components/ui/button";
import { notFound, redirect } from "next/navigation";
import TaskActionDropdown from "./task-action-dropdown";
import TaskSubmissionAlert from "./task-submission-alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import SubmitTaskDialog from "@/components/submit-task-dialog";
import CopyToClipboardButton from "@/components/copy-to-clipboard-button";
import { isSameDay, isToday, startOfToday } from "date-fns";
import TaskDeadlineAlert from "./task-deadline-alert";

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

        {user?.role === "ADMIN" && (
          <TaskActionDropdown taskId={task.id} className="shrink-0" />
        )}
      </div>

      <AspectRatio ratio={3 / 1} className="bg-muted relative">
        <Image
          fill
          alt="Photo by Drew Beamer"
          className="rounded-md object-cover"
          src={task.cover || "/images/task-cover.jpeg"}
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

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {task.title}
      </h3>

      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: task.description }}
      />

      <div className="flex items-center gap-2">
        <Input value={task.url} readOnly />
        <CopyToClipboardButton
          text={task.url}
          tooltip="Copy URL"
          className="shrink-0"
        />
      </div>

      {!user?.active ? (
        <TaskSubmissionAlert />
      ) : !isToday(task.deadline) ? (
        <TaskDeadlineAlert />
      ) : submission ? (
        <TaskSubmission
          description={submission.description}
          screenshots={submission.screenshots}
        />
      ) : (
        <SubmitTaskDialog taskId={task.id} className="w-full sm:w-auto" />
      )}
    </div>
  );
}
