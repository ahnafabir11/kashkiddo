import {
  PrismaClientRustPanicError,
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library";
import { z } from "zod";
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect";

export function getErrorMessage(err: unknown) {
  const unknownError = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return errors.join("\n");
  } else if (err instanceof Error) {
    return err.message;
  } else if (isRedirectError(err)) {
    throw err;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);
  return toast.error(errorMessage);
}

export function getServerActionError(error: unknown): Error {
  if (error instanceof z.ZodError) {
    return new Error("Invalid Data Provided", { cause: "Zod" });
  }

  if (
    error instanceof PrismaClientRustPanicError ||
    error instanceof PrismaClientValidationError ||
    error instanceof PrismaClientKnownRequestError ||
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientUnknownRequestError
  ) {
    return new Error("Internal Server Error", { cause: "Prisma" });
  }

  if (error instanceof Error) {
    return new Error(error.message, { cause: "Client" });
  }

  return new Error("Something Went Wrong", { cause: "Unknown" });
}
