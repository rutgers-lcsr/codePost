import { z } from "zod";
import { CommentTemplateSchema } from "./schema";

export type CommentTemplate = z.infer<typeof CommentTemplateSchema>;
