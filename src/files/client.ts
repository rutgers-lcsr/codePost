import { CodePostHTTP } from "../http";
import { BasicFunctions } from "../api";
import { FileModelSchema, FileSchema } from "./schema";
import { File } from "./types";

export const Files = {
    ...BasicFunctions<File>("/files", FileSchema),
};
