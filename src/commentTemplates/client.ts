import { BasicFunctions } from "../api/utils";
import { CommentTemplateSchema } from "./schema";
import { CommentTemplate } from "./types";

export const CommentTemplates = {
    ...BasicFunctions<CommentTemplate>("/commentTemplates", CommentTemplateSchema),
};
