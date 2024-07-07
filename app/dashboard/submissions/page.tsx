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
import TablePagination from "@/components/table-pagination";
import { PaginationShchema } from "@/lib/validations/pagination";
import SubmissionStatusDropdown from "./submission-status-dropdown";

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Submission Table Pagination
  const result = await PaginationShchema.safeParseAsync(searchParams);

  if (!result.success) {
    redirect(`/dashboard/submissions?page=${1}&per_page=${10}`);
  }

  const { page, per_page } = result.data;

  // Authentication
  const session = await auth();
  if (!session || !session.user) redirect("/login");
  if (session.user.role !== "ADMIN") notFound();

  // Data query
  const submissionCount = await prisma.submittedTask.count();

  const submissions = await prisma.submittedTask.findMany({
    take: per_page,
    skip: (page - 1) * per_page,
    orderBy: { createdAt: "desc" },
    include: { user: true, task: true },
  });

  return (
    <div className="space-y-8">
      <div className="border rounded-md">
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2}>Task</TableHead>
              <TableHead colSpan={6}>Submission Details</TableHead>
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
                    status={submission.status}
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

      <TablePagination total={submissionCount} page={page} perPage={per_page} />
    </div>
  );
}
