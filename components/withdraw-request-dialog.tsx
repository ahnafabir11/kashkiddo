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
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  WithdrawFormType,
  withdrawFormSchema,
} from "@/lib/validations/account";
import { toast } from "sonner";
import * as React from "react";
import { useForm } from "react-hook-form";
import { fireworks } from "@/lib/confetti";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { minWithdrawAmmount } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWithdrawRequest } from "@/lib/actions/payment";

export interface WithdrawRequestDialogProps {
  balance: number;
  className?: string;
  withdrawCount: number;
}

export default function WithdrawRequestDialog({
  balance,
  className,
  withdrawCount,
}: WithdrawRequestDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<WithdrawFormType>({
    resolver: zodResolver(withdrawFormSchema),
  });

  async function onSubmit(values: WithdrawFormType) {
    if (withdrawCount >= 1) {
      toast.error("You are allowed to send 1 withdraw request per month");
      return;
    }

    if (balance < minWithdrawAmmount) {
      toast.error("Insufficient balance!");
      return;
    }

    setLoading(true);

    toast.promise(createWithdrawRequest(values), {
      loading: "Sending Withdraw Request",
      success: (data) => {
        form.reset();
        setOpen(false);
        fireworks();
        return data.message;
      },
      error: (data) => {
        return data.message;
      },
      finally: () => {
        setLoading(false);
      },
    });
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button className={className}>Withdraw Request</Button>
      </CredenzaTrigger>

      <CredenzaContent className="md:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Withdraw Request</CredenzaTitle>
          <CredenzaDescription>
            It will take up to 24 hours to approve your request.
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody>
          <Form {...form}>
            <form
              noValidate
              className="grid gap-4"
              id="withdraw-request-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Minimum amount is {minWithdrawAmmount} TK.
                    </FormDescription>
                  </FormItem>
                )}
              />

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
                    <FormDescription>
                      Any bKash or Nagad number (Personal)
                    </FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CredenzaBody>

        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button type="button" variant="secondary" disabled={loading}>
              Close
            </Button>
          </CredenzaClose>

          <Button form="withdraw-request-form" type="submit" disabled={loading}>
            Send Request
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
