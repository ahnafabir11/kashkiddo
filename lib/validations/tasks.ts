import { z } from "zod";

export const taskFromSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url().min(1),
  amount: z.coerce.number().gte(1).lte(10),
  deadline: z.date(),
  cover: z.string().url().min(1).optional(),
});

export type TaskFormType = z.infer<typeof taskFromSchema>;

export const taskSubmissionSchema = z.object({
  screenshots: z.array(z.instanceof(File)),
  description: z.string().min(1).optional(),
});

export type TaskSubmissionType = z.infer<typeof taskSubmissionSchema>;

export const taskSubmissionServerSchema = z.object({
  screenshots: z.array(z.string().url().min(1)),
  description: z.string().min(1).optional(),
});

export type TaskSubmissionServerType = z.infer<
  typeof taskSubmissionServerSchema
>;
