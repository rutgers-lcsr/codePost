import z from "zod";
import { RubricCategorySchema, RubricCategoryStudentSchema } from "./schema";

export type RubricCategory = z.infer<typeof RubricCategorySchema>;
export type RubricCategoryStudent = z.infer<typeof RubricCategoryStudentSchema>;
