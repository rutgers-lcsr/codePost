import { z } from "zod";

export const QueryListParamsSchema = z.object({
    page: z.number().min(1).default(1).optional(),
    page_size: z.number().min(1).default(10).optional(),
});

export const QueryResponseSchemaBase = z.object({
    count: z.number().min(0).default(0),
    next: z.number().min(0).default(0).nullable(),
    previous: z.number().min(0).default(0).nullable(),
});
