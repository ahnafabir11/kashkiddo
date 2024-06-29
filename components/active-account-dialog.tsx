"use client";

import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaTitle,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaContent,
  CredenzaTrigger,
  CredenzaDescription,
} from "@/components/ui/credenza";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  ActiveAccountFormType,
  activeAccountFormSchema,
} from "@/lib/validations/account";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { fireworks } from "@/lib/confetti";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { activationCharge } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleServerAction } from "@/lib/handle-error";
import { createActivationRequest } from "@/lib/actions/user";

interface ActiveAccountDialogProps {
  submitted: boolean;
  className?: string;
}

export default function ActiveAccountDialog({
  submitted,
  className,
}: ActiveAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ActiveAccountFormType>({
    resolver: zodResolver(activeAccountFormSchema),
  });

  async function onSubmit(values: ActiveAccountFormType) {
    setLoading(true);

    await handleServerAction(createActivationRequest(values), {
      loading: "Sending Activation Request",
      success: () => {
        form.reset();
        setOpen(false);
        fireworks();
      },
      finally: () => {
        setLoading(false);
      },
    });
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button className={cn("w-full", className)} disabled={submitted}>
          {submitted ? "Request Pending" : "Active"}
        </Button>
      </CredenzaTrigger>

      <CredenzaContent className="md:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Active your account</CredenzaTitle>
          <CredenzaDescription>
            bKash/Nagad send money on 01775390977 ({activationCharge}TK)
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody>
          <Form {...form}>
            <form
              noValidate
              className="grid gap-4"
              id="active-account-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="01885365975" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID</FormLabel>
                    <FormControl>
                      <Input placeholder="BE959XY4XR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CredenzaBody>

        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button type="button" variant="secondary" disabled={loading}>
              Cancel
            </Button>
          </CredenzaClose>

          <Button form="active-account-form" type="submit" disabled={loading}>
            Send Request
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
