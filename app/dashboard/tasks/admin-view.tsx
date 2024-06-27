import prisma from "@/lib/db";
import TaskCard from "@/components/task-card";
import TaskDialog from "@/components/task-dialog";

export default async function AdminView() {
  const tasks = await prisma.task.findMany({ orderBy: { deadline: "desc" } });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <TaskDialog className="w-full sm:w-auto" />
      </div>

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
    </div>
  );
}
