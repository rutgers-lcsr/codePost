import { CodePostHTTP } from "../http";
import { BasicFunctions } from "../api";
import { FileModelSchema, FileSchema } from "./schema";
import { FileModel } from "./types";

export const Files = {
    ...BasicFunctions<FileModel>("/files", FileSchema),
};
