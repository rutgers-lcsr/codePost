import { CodePostHTTP } from "../http";
import { BasicFunctions } from "../api/utils";
import { RunResponse, TestCase } from "./types";
import { TestCaseSchema } from "./schema";

export const TestCases = {
    ...BasicFunctions<TestCase>("/testCases", TestCaseSchema),
    run: async (testCaseId: number, submissionId: number, files: { [filename: string]: string }) => {
        return await CodePostHTTP.post<RunResponse>(`/testCases/${testCaseId}/`, {
            submission: submissionId,
            files: JSON.stringify(files),
        });
    },
};
