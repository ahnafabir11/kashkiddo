import TaskCard from "@/components/task-card";
import prisma from "@/lib/db";
import { startOfToday } from "date-fns";

export default async function UserView() {
  const tasks = await prisma.task.findMany({
    orderBy: { deadline: "desc" },
    where: { deadline: startOfToday() },
  });

  return (
    <div>
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
