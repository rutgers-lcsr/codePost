import { z } from "zod";

export const SectionSchema = z.object({
    name: z.string().max(16),
    id: z.number(),
    course: z.number(),
    leaders: z.array(z.email()),
    students: z.array(z.email()),
});
