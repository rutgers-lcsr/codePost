import { z } from "zod";
import { FileTemplateModelSchema, FileTemplateSchema } from "./schema";

export type FileTemplateModel = z.infer<typeof FileTemplateModelSchema>;
export type FileTemplate = z.infer<typeof FileTemplateSchema>;
