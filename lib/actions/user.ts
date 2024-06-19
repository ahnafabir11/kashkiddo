"use server";

import prisma from "../db";
import { revalidatePath } from "next/cache";
import { StatusDropdownProps } from "@/app/dashboard/users/status-dropdown";
import { ActivationStatusDropdownProps } from "@/app/dashboard/activations/activation-status-dropdown";
import { referralBonus } from "../constants";
import { SignupFormType, signupFormSchema } from "../validations/auth";
import { ZodError } from "zod";
import { hashPassword } from "../utils";
import { ActiveAccountFormType } from "../validations/account";

export async function signupNewUser(data: SignupFormType) {
  try {
    const { name, email, password, referCode } =
      await signupFormSchema.parseAsync(data);

    // Checking if user is already exist
    const isUserExist = await prisma.user.findUnique({ where: { email } });
    if (isUserExist) return { success: false, message: "User already exists" };

    let referredByUserId = null;

    // Validating refer code
    if (referCode) {
      const isReferCodeValid = await prisma.user.findUnique({
        where: { id: referCode },
      });

      if (!isReferCodeValid) {
        return { success: false, message: "Invalid refer code" };
      } else {
        referredByUserId = isReferCodeValid.id;
      }
    }

    // Creating new user
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // If refer code is valid
    // creating referral request
    if (referredByUserId) {
      await prisma.referral.create({
        data: {
          referredBy: { connect: { id: referredByUserId } },
          referredTo: { connect: { id: user.id } },
        },
      });
    }

    return { success: true, message: "Successfully signed up." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: "Invalid credentials" };
    }

    return { success: false, message: "Couldn't create new account" };
  }
}

export async function handleUpdateStatus({
  type,
  value,
  userId,
}: StatusDropdownProps) {
  const upatedUser = await prisma.user.update({
    where: { id: userId },
    include: { referredBy: { include: { referredBy: true } } },
    data: type === "active" ? { active: !value } : { verified: !value },
  });

  if (upatedUser.referredBy?.id) {
    const referredByUser = upatedUser.referredBy;

    await prisma.user.update({
      where: { id: referredByUser.referredById },
      data: { balance: { increment: referralBonus } },
    });

    await prisma.tansaction.create({
      data: {
        type: "INCOME",
        reason: "REFERRAL",
        amount: referralBonus,
        user: { connect: { id: referredByUser.referredById } },
      },
    });
  }

  revalidatePath("/dashboard/users");
}

export async function handleUpdateActivationStatus({
  value,
  requestId,
}: ActivationStatusDropdownProps) {
  await prisma.activation.update({
    where: { id: requestId },
    data: { complete: !value },
  });
  revalidatePath("/dashboard/activations");
}

export async function createActivationRequest(
  userId: string,
  data: ActiveAccountFormType
) {
  await prisma.activation.create({
    data: { user: { connect: { id: userId } }, ...data },
  });

  revalidatePath("/dashboard/activations");
}
