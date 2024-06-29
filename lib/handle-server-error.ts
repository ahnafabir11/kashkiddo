import {
  PrismaClientRustPanicError,
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library";
import { z } from "zod";

export function getServerActionError(error: unknown) {
  if (error instanceof z.ZodError) {
    return { success: false, message: "Invalid Data Provided" };
  }

  if (
    error instanceof PrismaClientRustPanicError ||
    error instanceof PrismaClientValidationError ||
    error instanceof PrismaClientKnownRequestError ||
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientUnknownRequestError
  ) {
    return { success: false, message: "Internal Server Error" };
  }

  if (error instanceof Error) {
    // checking is error from Next-Auth
    if (error.cause && error.cause.hasOwnProperty("provider")) {
      return { success: false, message: "Invalid Data Provided" };
    }

    // returning custom error message
    // thrown in server actions
    return { success: false, message: error.message };
  }

  return { success: false, message: "Something Went Wrong" };
}
