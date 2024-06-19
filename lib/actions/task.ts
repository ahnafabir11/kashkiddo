"use server";

import prisma from "../db";
import {
  TaskFormType,
  taskFromSchema,
  TaskSubmissionServerType,
  taskSubmissionServerSchema,
} from "../validations/tasks";
import { revalidatePath } from "next/cache";
import { TaskSubmissionStatus } from "@prisma/client";

export async function createNewTask(data: TaskFormType) {
  const result = taskFromSchema.safeParse(data);

  if (result.error) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, errors };
  }

  await prisma.task.create({ data: result.data });

  revalidatePath("/dashboard/tasks");
  return { success: true };
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({ where: { id: taskId } });

  revalidatePath("/dashboard/tasks");
}

export async function submitTask(
  data: TaskSubmissionServerType,
  taskId: string,
  userId: string
) {
  const result = taskSubmissionServerSchema.safeParse(data);

  if (result.error) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, errors };
  }

  await prisma.submittedTask.create({
    data: {
      ...result.data,
      user: { connect: { id: userId } },
      task: { connect: { id: taskId } },
    },
  });
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/tasks/" + taskId);
}

export async function updateSubmissionStatus(
  userId: string,
  taskId: string,
  submissionId: string,
  value: TaskSubmissionStatus
) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) return;

  const submission = await prisma.submittedTask.findUnique({
    where: { id: submissionId },
  });

  if (!submission) return;

  await prisma.submittedTask.update({
    where: { id: submissionId },
    data: { status: value },
  });

  if (
    value === "COMPLETED" &&
    submission.createdAt.getTime() === submission.updatedAt.getTime()
  ) {
    await prisma.tansaction.create({
      data: {
        type: "INCOME",
        reason: "TASK",
        amount: task.amount,
        user: { connect: { id: userId } },
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: task.amount } },
    });
  }

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/submissions");
  revalidatePath("/dashboard/tasks/" + taskId);
}
