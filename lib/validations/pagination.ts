import { z } from "zod";

export const PaginationShchema = z.object({
  page: z.coerce
    .number({
      required_error: "Page number is required!",
      invalid_type_error: "Page number must be a number!",
    })
    .min(1, "Invalid page number provided"),
  per_page: z.coerce
    .number({
      required_error: "Per page is required!",
      invalid_type_error: "Per page must be a number!",
    })
    .min(1, "Invalid per page number provided"),
  search: z
    .string({
      required_error: "Search params is required!",
      invalid_type_error: "Search params must be a string!",
    })
    .optional(),
});
