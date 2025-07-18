import { z } from "zod";

export const SectionSchema = z.object({
    name: z.string(),
    id: z.number(),
    course: z.number(),
    leaders: z.array(z.string()),
    students: z.array(z.string()),
});
