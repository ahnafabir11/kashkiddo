"use server";

import prisma from "../db";
import { revalidatePath } from "next/cache";
import { WithdrawFormType } from "../validations/account";
import { PaymentStatusDropdownProps } from "@/app/dashboard/payments/payment-status-dropdown";

export async function handleUpdatePaymentStatus({
  value,
  paymentId,
}: PaymentStatusDropdownProps) {
  await prisma.payment.update({
    where: { id: paymentId },
    data: { complete: !value },
  });

  revalidatePath("/dashboard/payments");
}

export async function createWithdrawRequest(
  userId: string,
  data: WithdrawFormType
) {
  await prisma.user.update({
    where: { id: userId },
    data: { balance: { decrement: data.amount } },
  });

  await prisma.payment.create({
    data: { ...data, user: { connect: { id: userId } } },
  });

  await prisma.tansaction.create({
    data: {
      amount: data.amount,
      type: "EXPENSE",
      reason: "WITHDRAW",
      user: { connect: { id: userId } },
    },
  });

  revalidatePath("/dashboard/wallet");
}
