import { CodePostHTTP } from "../http";
import { BasicFunctions } from "../api";
import { SubmissionTest } from "./types";
import { SubmissionTestSchema } from "./schema";

export const SubmissionTests = {
    ...BasicFunctions<SubmissionTest>("/testCategories", SubmissionTestSchema),
};
