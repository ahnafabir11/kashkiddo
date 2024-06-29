"use client";

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { credentialsSignin } from "@/lib/actions/user";
import { handleServerAction } from "@/lib/handle-error";
import { PasswordInput } from "@/components/ui/password-input";
import { loginFormSchema, LoginFormType } from "@/lib/validations/auth";

export default function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(values: LoginFormType) {
    setLoading(true);

    await handleServerAction(credentialsSignin(values), {
      loading: "Log-ining User",
      success: () => {
        form.reset();
        router.push("/dashboard");
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
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          Login
        </Button>

        <Button variant="outline" className="w-full" disabled>
          Login with Google
        </Button>
      </form>
    </Form>
  );
}
