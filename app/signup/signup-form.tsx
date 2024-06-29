"use client";

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signupNewUser } from "@/lib/actions/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleServerAction } from "@/lib/handle-error";
import { PasswordInput } from "@/components/ui/password-input";
import { signupFormSchema, SignupFormType } from "@/lib/validations/auth";

export default function SignupForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<SignupFormType>({
    resolver: zodResolver(signupFormSchema),
  });

  async function onSubmit(values: SignupFormType) {
    setLoading(true);

    await handleServerAction(signupNewUser(values), {
      loading: "Creating New Account",
      success: () => {
        form.reset();
        router.push("/login");
      },
      finally: () => {
        setLoading(false);
      },
    });
  }

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johndoe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Refer Code (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="clx50h6p80000l5l1hufmtwtn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          Create an account
        </Button>

        <Button variant="outline" className="w-full" disabled>
          Sign up with Google
        </Button>
      </form>
    </Form>
  );
}
