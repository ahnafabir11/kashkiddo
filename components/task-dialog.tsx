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
import * as React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createNewTask } from "@/lib/actions/task";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleServerAction } from "@/lib/handle-error";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskFormType, taskFromSchema } from "@/lib/validations/tasks";

export interface TaskDialogProps {
  className?: string;
}

export default function TaskDialog({ className }: TaskDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<TaskFormType>({
    resolver: zodResolver(taskFromSchema),
  });

  async function onSubmit(values: TaskFormType) {
    setLoading(true);

    await handleServerAction(createNewTask(values), {
      loading: "Creating New Task",
      success: () => {
        form.reset();
        setOpen(false);
      },
      finally: () => {
        setLoading(false);
      },
    });
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button className={className}>Create New Task</Button>
      </CredenzaTrigger>

      <CredenzaContent className="md:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Add New Task</CredenzaTitle>
          <CredenzaDescription>
            Task will be available for only 24 hours
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody>
          <ScrollArea className="h-72">
            <Form {...form}>
              <form
                noValidate
                className="grid gap-4"
                id="task-creation-form"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Subscribe to the YouTube Channel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="How the task is supposed to be completed..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://youtbute.com/ahnafabir11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Deadline</FormLabel>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={{ before: new Date() }}
                        className="border rounded-md"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://drive.google.com/imageid"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </ScrollArea>
        </CredenzaBody>

        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button type="button" variant="secondary" disabled={loading}>
              Close
            </Button>
          </CredenzaClose>

          <Button form="task-creation-form" type="submit" disabled={loading}>
            Create
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
