import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TaskCard from "@/components/task-card";
import TaskDialog from "@/components/task-dialog";
import TablePagination from "@/components/table-pagination";
import { PaginationShchema } from "@/lib/validations/pagination";
import { startOfToday } from "date-fns";

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Submission Table Pagination
  const result = await PaginationShchema.safeParseAsync(searchParams);

  if (!result.success) {
    redirect(`/dashboard/tasks?page=${1}&per_page=${10}`);
  }

  const { page, per_page } = result.data;

  // Authentication
  const session = await auth();
  if (!session || !session.user) redirect("/login");

  const isAdmin = session.user.role === "ADMIN";

  // Data query
  const taskCount = await prisma.task.count({
    where: { deadline: isAdmin ? {} : { lte: startOfToday() } },
  });

  const tasks = await prisma.task.findMany({
    take: per_page,
    skip: (page - 1) * per_page,
    orderBy: { deadline: "desc" },
    where: { deadline: isAdmin ? {} : { lte: startOfToday() } },
  });

  return (
    <main className="space-y-8">
      {isAdmin && (
        <div className="flex justify-end">
          <TaskDialog className="w-full sm:w-auto" />
        </div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {tasks.map((task) => (
          <TaskCard
            id={task.id}
            key={task.id}
            title={task.title}
            cover={task.cover}
            className="flex-1"
            amount={task.amount}
            deadline={task.deadline}
            description={task.description}
          />
        ))}
      </div>

      <TablePagination total={taskCount} page={page} perPage={per_page} />
    </main>
  );
}
