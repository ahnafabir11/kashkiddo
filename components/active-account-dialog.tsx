"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ActiveAccountFormType,
  activeAccountFormSchema,
} from "@/lib/validations/account";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { fireworks } from "@/lib/confetti";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { activationCharge } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { createActivationRequest } from "@/lib/actions/user";

interface ActiveAccountDialogProps {
  userId: string;
  submitted: boolean;
}

export default function ActiveAccountDialog({
  userId,
  submitted,
}: ActiveAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ActiveAccountFormType>({
    resolver: zodResolver(activeAccountFormSchema),
  });

  async function onSubmit(values: ActiveAccountFormType) {
    setLoading(true);
    await createActivationRequest(userId, values);
    form.reset();
    setOpen(false);
    setLoading(false);
    fireworks();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full" disabled={submitted}>
          {submitted ? "Request Pending" : "Active"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Active your account</DialogTitle>
          <DialogDescription>
            bKash/Nagad send money on 01775390977 ({activationCharge}TK)
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
