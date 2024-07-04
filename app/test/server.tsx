// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";
import prisma from "@/lib/db";
import { startOfToday } from "date-fns";

export default async function Server() {
  const date = startOfToday();
  const task = await prisma.task.findMany();

  return (
    <div>
      <h1 className="text-lg">Server</h1>
      {date.toString()}
      <pre>{JSON.stringify(task, null, 2)}</pre>
    </div>
  );
}
