import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string({
      required_error: "Email is Required!",
      invalid_type_error: "Email must be a string!",
    })
    .min(1, "Email is required!")
    .email("Email is not valid!"),
  password: z
    .string({
      required_error: "Password is Required!",
      invalid_type_error: "Password must be a string!",
    })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

export const signupFormSchema = z.object({
  name: z
    .string({
      required_error: "Name is Required!",
      invalid_type_error: "Name must be a string!",
    })
    .min(1, "Name is required!"),
  email: z
    .string({
      required_error: "Email is Required!",
      invalid_type_error: "Email must be a string!",
    })
    .min(1, "Email is required!")
    .email("Email is not valid!"),
  password: z
    .string({
      required_error: "Password is Required!",
      invalid_type_error: "Password must be a string!",
    })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  referCode: z
    .string({
      invalid_type_error: "Refer Code must be a string!",
    })
    .optional(),
});

export type SignupFormType = z.infer<typeof signupFormSchema>;