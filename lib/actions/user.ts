"use server";

import {
  LoginFormType,
  SignupFormType,
  loginFormSchema,
  signupFormSchema,
} from "@/lib/validations/auth";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { referralBonus } from "@/lib/constants";
import { auth, signIn, signOut } from "@/lib/auth";
import { getServerActionError } from "@/lib/handle-error";
import { ActiveAccountFormType } from "@/lib/validations/account";
import { StatusDropdownProps } from "@/app/dashboard/users/status-dropdown";
import { ActivationStatusDropdownProps } from "@/app/dashboard/activations/activation-status-dropdown";

export async function signupNewUser(data: SignupFormType) {
  try {
    const { name, email, password, referCode } =
      await signupFormSchema.parseAsync(data);

    // Checking if user is already exist
    const isUserExist = await prisma.user.findUnique({ where: { email } });
    if (isUserExist) {
      throw new Error("Already Have An Account With This Email");
    }

    let referredByUserId = null;

    // Validating refer code
    if (referCode) {
      const isReferCodeValid = await prisma.user.findUnique({
        where: { id: referCode },
      });

      if (!isReferCodeValid) {
        throw new Error("Invalid Refer Code Provided");
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

    return { success: true, message: "Account Created Successfully" };
  } catch (error) {
    throw getServerActionError(error);
  }
}

export async function credentialsSignin(data: LoginFormType) {
  try {
    const values = await loginFormSchema.parseAsync(data);

    await signIn("credentials", { ...values, redirect: false });

    return { success: true, message: "User Logged In Successfully" };
  } catch (error) {
    throw getServerActionError(error);
  }
}

export async function signoutUser() {
  try {
    await signOut({ redirect: false });

    return { success: true, message: "User Signed Out Successfully" };
  } catch (error) {
    throw getServerActionError(error);
  }
}

export async function createActivationRequest(data: ActiveAccountFormType) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error("Unauthorized");
    }

    await prisma.activation.create({
      data: { user: { connect: { id: session.user.id } }, ...data },
    });

    revalidatePath("/dashboard/activations");

    return { success: false, message: "Activation Request Sent" };
  } catch (error) {
    throw getServerActionError(error);
  }
}

export async function handleUpdateActivationStatus({
  value,
  requestId,
}: ActivationStatusDropdownProps) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.activation.update({
      where: { id: requestId },
      data: { complete: !value },
    });

    revalidatePath("/dashboard/activations");
  } catch (error) {
    throw getServerActionError(error);
  }
}

export async function handleUpdateStatus({
  type,
  value,
  userId,
}: StatusDropdownProps) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

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
  } catch (error) {
    throw getServerActionError(error);
  }
}
