import prisma from "@/lib/db";
import { format, startOfToday } from "date-fns";

export default async function Server() {
  console.log("JS Date", new Date());
  console.log("SNF Start Today", startOfToday());

  const task = await prisma.task.findMany();
  console.log("task", task[0]?.deadline);

  return <div>server</div>;
}
