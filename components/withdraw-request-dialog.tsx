"use client";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "./ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from "./ui/form";
import {
  WithdrawFormType,
  withdrawFormSchema,
} from "@/lib/validations/account";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWithdrawRequest } from "@/lib/actions/payment";
import { minWithdrawAmmount } from "@/lib/constants";

export interface WithdrawRequestDialogProps {
  userId: string;
  balance: number;
  className?: string;
  withdrawCount: number;
}

export default function WithdrawRequestDialog({
  userId,
  balance,
  className,
  withdrawCount,
}: WithdrawRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
    await createWithdrawRequest(userId, values);
    form.reset();
    setOpen(false);
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={className}>
          Withdraw Request
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Request</DialogTitle>
          <DialogDescription>
            It will take up to 24 hours to approve your request.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            className="grid gap-4"
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
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                Send Request
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
