import {
  PrismaClientRustPanicError,
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library";
import { z } from "zod";

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
