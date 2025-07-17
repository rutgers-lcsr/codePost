import { CodePostHTTP } from "../http";
import { BasicFunctions } from "../api";
import { FileTemplateModel } from "./types";
import { FileTemplateSchema } from "./schema";

export const FileTemplates = {
    ...BasicFunctions<FileTemplateModel>("/files", FileTemplateSchema),
};
