"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  TaskSubmissionType,
  taskSubmissionSchema,
} from "@/lib/validations/tasks";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { fireworks } from "@/lib/confetti";
import { FileUploader } from "./file-uploader";
import { submitTask } from "@/lib/actions/task";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/handle-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadFile } from "@/lib/hooks/use-upload-file";

interface SubmitTaskDialogProps {
  userId: string;
  taskId: string;
  className?: string;
}

export default function SubmitTaskDialog({
  userId,
  taskId,
  className,
}: SubmitTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { uploadFiles, progresses, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] }
  );

  const form = useForm<TaskSubmissionType>({
    resolver: zodResolver(taskSubmissionSchema),
  });

  async function onSubmit(values: TaskSubmissionType) {
    setLoading(true);

    toast.promise(uploadFiles(values.screenshots), {
      loading: "Submitting task...",
      success: async (uploadedFiles) => {
        if (!uploadedFiles) return;
        const screenshots = uploadedFiles.map(({ url }) => url);
        await submitTask(
          { description: values.description, screenshots },
          taskId,
          userId
        );
        form.reset();
        setOpen(false);
        setLoading(false);
        fireworks();
        return "Task Submitted";
      },
      error: (err) => {
        setLoading(false);
        return getErrorMessage(err);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        <Button>Submit Task</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Task</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please read the task description and
            properly submit your task otherwise your submission will not be
            valid.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="screenshots"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={4}
                        maxSize={4 * 1024 * 1024}
                        progresses={progresses}
                        // pass the onUpload function here for direct upload
                        // onUpload={uploadFiles}
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Do you want to say any thing about task?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={loading} type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button disabled={loading} type="submit">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
