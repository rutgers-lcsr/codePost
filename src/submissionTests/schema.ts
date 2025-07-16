import z from "zod";

export const SubmissionTestSchema = z.object({
    id: z.number().int().describe("The unique ID of the submission test."),
    submission: z.number().int().describe("The related submission ID."),
    testCase: z.number().int().describe("The related test case ID."),
    logs: z.string().describe("The logs for this test run."),
    passed: z.boolean().describe("Whether the test was passed."),
    testCategory: z
        .number()
        .int()
        .describe(
            "The ID of the test category (from testCase.testCategory.id).",
        ),
    created: z.string().describe("The date this submission test was created."),
    modified: z
        .string()
        .describe("The date this submission test was last modified."),
    isError: z
        .boolean()
        .describe("Whether this test run resulted in an error."),
});
