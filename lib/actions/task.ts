"use server";

import {
  TaskFormType,
  taskFromSchema,
  TaskSubmissionServerType,
  taskSubmissionServerSchema,
} from "@/lib/validations/tasks";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { TaskSubmissionStatus } from "@prisma/client";
import { getServerActionError } from "@/lib/handle-server-error";

export async function createNewTask(data: TaskFormType) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const result = await taskFromSchema.parseAsync(data);

    await prisma.task.create({ data: result });

    revalidatePath("/dashboard/tasks");

    return { success: true, message: "Task Created Successfully" };
  } catch (error) {
    throw getServerActionError(error);
  }
}

export async function deleteTask(taskId: string) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.task.delete({ where: { id: taskId } });

    revalidatePath("/dashboard/tasks");

    return { success: true, message: "Task Deleted Successfully" };
  } catch (error) {
    throw getServerActionError(error);
  }
}

export async function submitTask(
  taskId: string,
  data: TaskSubmissionServerType
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error("Unauthorized");
    }

    const result = await taskSubmissionServerSchema.parseAsync(data);

    await prisma.submittedTask.create({
      data: {
        ...result,
        task: { connect: { id: taskId } },
        user: { connect: { id: session.user.id } },
      },
    });

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard/tasks/" + taskId);

    return { success: true, message: "Task Submitted Successfully" };
  } catch (error) {
    throw getServerActionError(error);
  }
}

export async function updateSubmissionStatus(
  userId: string,
  taskId: string,
  submissionId: string,
  value: TaskSubmissionStatus
) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const submission = await prisma.submittedTask.findUniqueOrThrow({
      where: { id: submissionId },
    });

    await prisma.submittedTask.update({
      where: { id: submissionId },
      data: { status: value },
    });

    if (
      value === "COMPLETED" &&
      submission.createdAt.getTime() === submission.updatedAt.getTime()
    ) {
      const task = await prisma.task.findUniqueOrThrow({
        where: { id: taskId },
      });

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

    return { success: true, message: "Submission Status Updated" };
  } catch (error) {
    throw getServerActionError(error);
  }
}
