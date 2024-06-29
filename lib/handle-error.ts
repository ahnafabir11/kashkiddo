import { z } from "zod";
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect";

type ServerActionResponse = { success: boolean; message: string };

type Callbacks = {
  loading?: string;
  success?: () => void;
  error?: () => void;
  finally?: () => void;
};

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

export const handleServerAction = async (
  action: Promise<ServerActionResponse>,
  options?: Callbacks
): Promise<void> => {
  const toastId = toast.loading("Loading", { duration: Infinity });

  try {
    const { success, message } = await action;

    if (success) {
      toast.success(message);
      options?.success?.();
    } else {
      toast.error(message);
      options?.error?.();
    }
  } catch {
    options?.error?.();
  } finally {
    toast.dismiss(toastId);
    options?.finally?.();
  }
};
