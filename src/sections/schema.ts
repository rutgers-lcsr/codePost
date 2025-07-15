import { z } from "zod";
import { CourseSchema } from "../courses";

export const SectionSchema = z.object({
    name: z.string(),
    id: z.number(),
    course: CourseSchema,
    leaders: z.array(z.string()),
    students: z.array(z.string()),
});
