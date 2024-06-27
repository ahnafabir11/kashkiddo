import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import SubmissionStatusDropdown from "./submission-status-dropdown";

export default async function page() {
  const session = await auth();
  if (!session || !session.user) redirect("/login");
  if (session.user.role !== "ADMIN") notFound();

  const submissions = await prisma.submittedTask.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, task: true },
  });

  return (
    <div className="border rounded-md">
      <Table className="whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2}>Task</TableHead>
            <TableHead colSpan={5}>Submission Details</TableHead>
          </TableRow>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Screenshots</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Updated At</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                <p>{submission.task.title}</p>
                <small>{submission.task.id}</small>
              </TableCell>
              <TableCell>
                <p>{submission.user.name}</p>
                <small>{submission.user.id}</small>
              </TableCell>
              <TableCell>
                <SubmissionStatusDropdown
                  value={submission.status}
                  userId={submission.userId}
                  taskId={submission.taskId}
                  submissionId={submission.id}
                />
              </TableCell>
              <TableCell>{submission.screenshots.join(" |$| ")}</TableCell>
              <TableCell>{submission.description}</TableCell>
              <TableCell>{submission.createdAt.toDateString()}</TableCell>
              <TableCell>{submission.updatedAt.toDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
