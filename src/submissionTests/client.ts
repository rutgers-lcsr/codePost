import { CodePostHTTP } from "../http";
import { BasicFunctions } from "../api/utils";
import { SubmissionTest } from "./types";
import { SubmissionTestSchema } from "./schema";

export const SubmissionTests = {
    ...BasicFunctions<SubmissionTest>("/testCategories", SubmissionTestSchema),
};
