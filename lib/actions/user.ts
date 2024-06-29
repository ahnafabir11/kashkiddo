"use server";

import {
  LoginFormType,
  SignupFormType,
  loginFormSchema,
  signupFormSchema,
} from "@/lib/validations/auth";
import {
  ActiveAccountFormType,
  activeAccountFormSchema,
} from "@/lib/validations/account";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { referralBonus } from "@/lib/constants";
import { auth, signIn, signOut } from "@/lib/auth";
import { getServerActionError } from "@/lib/handle-server-error";
import { ActiveStatusDropdownProps } from "@/app/dashboard/users/active-status-dropdown";
import { ActiveRequestStatusDropdownProps } from "@/app/dashboard/activations/active-request-status-dropdown";

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
    return getServerActionError(error);
  }
}

export async function credentialsSignin(data: LoginFormType) {
  try {
    const values = await loginFormSchema.parseAsync(data);

    await signIn("credentials", { ...values, redirect: false });

    return { success: true, message: "User Logged In Successfully" };
  } catch (error) {
    return getServerActionError(error);
  }
}

export async function signoutUser() {
  try {
    await signOut({ redirect: false });

    return { success: true, message: "User Signed Out Successfully" };
  } catch (error) {
    return getServerActionError(error);
  }
}

export async function createActivationRequest(data: ActiveAccountFormType) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error("Unauthorized");
    }

    const result = await activeAccountFormSchema.parseAsync(data);

    await prisma.activation.create({
      data: { user: { connect: { id: session.user.id } }, ...result },
    });

    revalidatePath("/dashboard/activations");

    return { success: true, message: "Activation Request Sent" };
  } catch (error) {
    return getServerActionError(error);
  }
}

export async function updateUserActiveStatus({
  status,
  userId,
}: ActiveStatusDropdownProps) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { active: !status },
    });

    // Checking if user is referred by someone
    const referral = await prisma.referral.findUnique({
      where: { referredToId: userId },
    });

    if (referral) {
      // Sending refer bonus to the referred by user
      await prisma.user.update({
        where: { id: referral.referredById },
        data: { balance: { increment: referralBonus } },
      });

      await prisma.tansaction.create({
        data: {
          type: "INCOME",
          reason: "REFERRAL",
          amount: referralBonus,
          user: { connect: { id: referral.referredById } },
        },
      });
    }

    revalidatePath("/dashboard/users");

    return { success: true, message: "User Active Status Updated" };
  } catch (error) {
    return getServerActionError(error);
  }
}

export async function updateActiveRequestStatus({
  status,
  requestId,
}: ActiveRequestStatusDropdownProps) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.activation.update({
      where: { id: requestId },
      data: { complete: !status },
    });

    revalidatePath("/dashboard/activations");

    return { success: true, message: "Active Request Status Updated" };
  } catch (error) {
    return getServerActionError(error);
  }
}
