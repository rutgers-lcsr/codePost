import z from "zod";
import { TestCategorySchema } from "./schema";

export type TestCategory = z.infer<typeof TestCategorySchema>;
