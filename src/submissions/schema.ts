import { z } from "zod";
import { QueryResponseSchemaBase } from "../api";
export const SubmissionSchema = z.object({
    assignment: z.number().int().describe("The related assignment_id."),
    students: z
        .array(z.string())
        .describe("A list of usernames of students for the submission."),
    grader: z
        .string()
        .nullable()
        .describe("The username of the assigned grader for the submission."),
    isFinalized: z
        .boolean()
        .default(false)
        .describe(
            "A boolean field. 'True' if the submission is finalized. 'False' otherwise.",
        ),
    dateEdited: z
        .string()
        .describe(
            "The date this submission (or any of its associated files or comments) was last edited.",
        ),
    grade: z
        .number()
        .max(999.99)
        .nullable()
        .describe("The grade for the submission. Null if not graded yet."),
    queueOrderKey: z
        .number()
        .int()
        .default(0)
        .describe(
            "Index used to order the queue from which graders draw submissions. Will sort low to high.",
        ),
    gradeFrozen: z
        .boolean()
        .default(false)
        .describe(
            "A boolean field. If 'True', the submissions grade will not be re-calculated based on the current comments applied to it. Warning: this can cause grade to become out of sync with the submission's comments.",
        ),
    dateUploaded: z.string().describe("The date this submission was created."),
    lateDayCreditsUsed: z
        .number()
        .int()
        .default(0)
        .describe("The number of Late Day Credits used by the Submission."),
    questionIsOpen: z
        .boolean()
        .default(false)
        .describe(
            "A boolean field. If true the submission has an open question.",
        ),
    questionIsRegrade: z
        .boolean()
        .default(false)
        .describe(
            "A boolean field. If 'True', the submission's question is a regrade request.",
        ),
    questionResponder: z
        .string()
        .nullable()
        .describe("The username of the responder for the question."),
    questionText: z
        .string()
        .max(500)
        .optional()
        .describe("The text of the question."),
    questionResponse: z
        .string()
        .optional()
        .describe("The text of the question response."),
    questionDate: z
        .string()
        .nullable()
        .optional()
        .describe("The date the request / question was submitted."),
    responseDate: z
        .string()
        .nullable()
        .optional()
        .describe("The date the response was submitted."),
    testRunsCompleted: z
        .number()
        .int()
        .default(0)
        .describe(
            "Number of times exposed tests have been run for a submission. It only increments if the maxStudentTestRuns Environment setting is on.",
        ),
    course: z.number().int().describe("The related course_id."),
});
export const StudentSubmissionSchema = z.object({
    id: z.number().int().describe("The unique ID of the submission."),
    assignment: z.number().int().describe("The related assignment_id."),
    students: z
        .array(z.email())
        .describe("A list of emails of students for the submission."),
    isFinalized: z
        .boolean()
        .default(false)
        .describe(
            "A boolean field. 'True' if the submission is finalized. 'False' otherwise.",
        ),
    files: z.any().describe("The files associated with the submission."),
    grade: z.number().int().default(0).describe("The grade of the submission."),
    questionIsOpen: z
        .boolean()
        .default(false)
        .describe(
            "A boolean field. If true the submission has an open question.",
        ),
    questionIsRegrade: z
        .boolean()
        .default(false)
        .describe(
            "A boolean field. If 'True', the submission's question is a regrade request.",
        ),
    questionText: z
        .string()
        .max(500)
        .optional()
        .describe("The text of the question."),
    questionResponder: z
        .string()
        .email()
        .nullable()
        .optional()
        .describe("The email of the responder for the question."),
    questionResponse: z
        .string()
        .optional()
        .describe("The text of the question response."),
    questionDate: z
        .string()
        .nullable()
        .optional()
        .describe("The date the request / question was submitted."),
    responseDate: z
        .string()
        .nullable()
        .optional()
        .describe("The date the response was submitted."),
    dateUploaded: z.string().describe("The date this submission was created."),
    tests: z.any().describe("The tests associated with the submission."),
    testRunsCompleted: z
        .number()
        .int()
        .default(0)
        .describe(
            "Number of times exposed tests have been run for a submission. It only increments if the maxStudentTestRuns Environment setting is on.",
        ),
    lateDayCreditsUsed: z
        .number()
        .int()
        .default(0)
        .describe("The number of Late Day Credits used by the Submission."),
});

export const SubmissionListSchema = QueryResponseSchemaBase.extend({
    results: z.array(SubmissionSchema),
});

export const SubmissionsPermisionsSchema = z.object({
    read: z.boolean(),
    write: z.boolean(),
});

export const SubmissionHistorySchema = z.object({
    id: z
        .number()
        .int()
        .describe("The unique ID of the submission history entry."),
    student: z.email().describe("The email of the student."),
    submission: z.number().int().describe("The related submission ID."),
    hasViewed: z
        .boolean()
        .describe("Whether the student has viewed the submission."),
    dateViewed: z
        .string()
        .nullable()
        .describe(
            "The date the submission was viewed, in the course's timezone, or null if not viewed.",
        ),
});
export const QuerySubmissionHistorySchema = z.object({
    student: z.email().describe("The email of the student.").optional(),
});

export const UpdateSubmissionHistorySchema = z.object({
    student: z.email().describe("The email of the student."),
    hasViewed: z
        .boolean()
        .describe("Whether the student has viewed the submission."),
});
export const RegradeRequestSchema = z.object({
    questionText: z.string().describe("The text of the question to regrade."),
    questionIsRegrade: z
        .boolean()
        .describe("Whether the question is a regrade.")
        .optional(),
});

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
export const TestResultsResponseSchema = z.object({
    submissionTests: z
        .array(SubmissionTestSchema)
        .describe("The submission tests."),
    logs: z.string().describe("The logs for this test run."),
});
export const PartnerLinkResponseSchema = z.object({
    id: z.string().describe("The unique ID of the submission."),
    token: z.string().describe("The token for the partner link."),
});
export const QueryPartnerLinkSchema = z.object({
    token: z.string().describe("The token for the partner link."),
});
