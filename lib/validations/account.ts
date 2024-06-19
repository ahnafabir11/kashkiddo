import { z } from "zod";
import { minWithdrawAmmount } from "../constants";

export const activeAccountFormSchema = z.object({
  phoneNumber: z
    .string({
      required_error: "Phone number is required!",
      invalid_type_error: "Phone number must be a string!",
    })
    .min(1, "Phone nunber is required!")
    .length(11, "Phone nunber is not valid!"),
  transactionId: z
    .string({
      required_error: "Transaction ID is required!",
      invalid_type_error: "Transaction ID must be a string!",
    })
    .min(1, "Transaction ID is required!"),
});

export type ActiveAccountFormType = z.infer<typeof activeAccountFormSchema>;

export const withdrawFormSchema = z.object({
  amount: z.coerce
    .number({
      required_error: "Amount is required!",
      invalid_type_error: "Amount must be a number!",
    })
    .min(minWithdrawAmmount, `Minimum amount is ${minWithdrawAmmount} TK`),
  phoneNumber: z
    .string({
      required_error: "Phone number is required!",
      invalid_type_error: "Phone number must be a string!",
    })
    .min(1, "Phone nunber is required!")
    .length(11, "Phone nunber is not valid!"),
});

export type WithdrawFormType = z.infer<typeof withdrawFormSchema>;
