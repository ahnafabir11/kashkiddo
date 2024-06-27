"use server";

import {
  WithdrawFormType,
  withdrawFormSchema,
} from "@/lib/validations/account";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getServerActionError } from "@/lib/handle-server-error";
import { PaymentStatusDropdownProps } from "@/app/dashboard/payments/payment-status-dropdown";

export async function updatePaymentStatus({
  status,
  paymentId,
}: PaymentStatusDropdownProps) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: { complete: !status },
    });

    revalidatePath("/dashboard/payments");

    return { success: true, message: "Payment Status Updated" };
  } catch (error) {
    throw getServerActionError(error);
  }
}

export async function createWithdrawRequest(data: WithdrawFormType) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error("Unauthorized");
    }

    const result = await withdrawFormSchema.parseAsync(data);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { balance: { decrement: result.amount } },
    });

    await prisma.payment.create({
      data: { user: { connect: { id: session.user.id } }, ...result },
    });

    await prisma.tansaction.create({
      data: {
        type: "EXPENSE",
        reason: "WITHDRAW",
        amount: data.amount,
        user: { connect: { id: session.user.id } },
      },
    });

    revalidatePath("/dashboard/wallet");

    return { success: true, message: "Withdraw Request Sent" };
  } catch (error) {
    throw getServerActionError(error);
  }
}
