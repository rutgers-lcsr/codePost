import { z } from "zod";
import { QueryResponseSchemaBase } from "../api";
import { SubmissionTestSchema } from "../submissionTests";
export const SubmissionModelSchema = z.object({
    assignment: z.number().int().describe("The related assignment_id."),
    students: z.array(z.string()).describe("A list of usernames of students for the submission."),
    grader: z.string().nullable().describe("The username of the assigned grader for the submission."),
    isFinalized: z.boolean().default(false).describe("A boolean field. 'True' if the submission is finalized. 'False' otherwise."),
    dateEdited: z.string().describe("The date this submission (or any of its associated files or comments) was last edited."),
    grade: z.number().max(999.99).nullable().describe("The grade for the submission. Null if not graded yet."),
    queueOrderKey: z.number().int().default(0).describe("Index used to order the queue from which graders draw submissions. Will sort low to high."),
    gradeFrozen: z
        .boolean()
        .default(false)
        .describe(
            "A boolean field. If 'True', the submissions grade will not be re-calculated based on the current comments applied to it. Warning: this can cause grade to become out of sync with the submission's comments."
        ),
    dateUploaded: z.string().describe("The date this submission was created."),
    lateDayCreditsUsed: z.number().int().default(0).describe("The number of Late Day Credits used by the Submission."),
    questionIsOpen: z.boolean().default(false).describe("A boolean field. If true the submission has an open question."),
    questionIsRegrade: z.boolean().default(false).describe("A boolean field. If 'True', the submission's question is a regrade request."),
    questionResponder: z.string().nullable().describe("The username of the responder for the question."),
    questionText: z.string().max(500).optional().describe("The text of the question."),
    questionResponse: z.string().optional().describe("The text of the question response."),
    questionDate: z.string().nullable().optional().describe("The date the request / question was submitted."),
    responseDate: z.string().nullable().optional().describe("The date the response was submitted."),
    testRunsCompleted: z
        .number()
        .int()
        .default(0)
        .describe(
            "Number of times exposed tests have been run for a submission. It only increments if the maxStudentTestRuns Environment setting is on."
        ),
    course: z.number().int().describe("The related course_id."),
});

export const SubmissionsTestSchema = z.object({
    id: z.number(),
    submission: z.number(),
    testCase: z.number(),
    logs: z.string(),
    passed: z.boolean(),
    testCategory: z.number(),
    created: z.string(),
    modified: z.string(),
    isError: z.boolean(),
});
// Base object for shared fields
export const SubmissionBaseSchema = z.object({
    id: z.number(),
    assignment: z.number(), // ForeignKey to Assignment (use z.object({...}) if nested)
    students: z.array(z.email()), // ManyToMany to User, represented as emails
    grader: z.email().nullable().optional(), // ForeignKey to User, email
    isFinalized: z.boolean(),
    dateEdited: z.string().optional(), // ISO date string
    grade: z.number().nullable().optional(), // Assuming grade is a number, adjust if needed
    queueOrderKey: z.number().nullable().optional(),
    dateUploaded: z.string().optional(), // ISO date string
    questionIsOpen: z.boolean().optional(),
    questionIsRegrade: z.boolean().optional(),
    questionText: z.string().nullable().optional(),
    questionResponder: z.email().nullable().optional(),
    questionResponse: z.string().nullable().optional(),
    questionDate: z.string().optional(), // ISO date string
    responseDate: z.string().optional(), // ISO date string
    tests: z.array(SubmissionsTestSchema).optional(),
    testRunsCompleted: z.number().nullable().optional(),
    lateDayCreditsUsed: z.number().nullable().optional(),
});

// SubmissionSerializerWithoutFiles
export const SubmissionWithoutFilesSchema = SubmissionBaseSchema;

// SubmissionSerializer (adds files)
export const SubmissionSchema = SubmissionBaseSchema.extend({
    files: z.array(z.number()).optional(),
});

// AnonymousSubmissionSerializer
export const AnonymousSubmissionSchema = SubmissionBaseSchema.omit({
    students: true,
});

// SubmissionStatusSerializer omits tests grader dateEdited  grade  queueOrderKey
export const SubmissionStatusSchema = SubmissionBaseSchema.omit({
    tests: true,
    grader: true,
    dateEdited: true,
    grade: true,
    queueOrderKey: true,
});

// StudentSubmissionSerializer
export const StudentSubmissionSchema = SubmissionSchema.omit({
    grader: true,
});

// StudentSubmissionWithoutGradeSerializer
export const StudentSubmissionWithoutGradeSchema = StudentSubmissionSchema.omit({ grade: true });

// SubmissionWithTestsSerializer
export const SubmissionWithTestsSchema = z.object({
    id: z.number(),
    tests: z.array(SubmissionsTestSchema), // Replace with SubmissionTest schema if available
});

export const SubmissionListSchema = QueryResponseSchemaBase.extend({
    results: z.array(SubmissionModelSchema),
});

export const SubmissionsPermisionsSchema = z.object({
    read: z.boolean(),
    write: z.boolean(),
});

export const SubmissionHistorySchema = z.object({
    id: z.number().int().describe("The unique ID of the submission history entry."),
    student: z.email().describe("The email of the student."),
    submission: z.number().int().describe("The related submission ID."),
    hasViewed: z.boolean().describe("Whether the student has viewed the submission."),
    dateViewed: z.string().nullable().describe("The date the submission was viewed, in the course's timezone, or null if not viewed."),
});
export const QuerySubmissionHistorySchema = z.object({
    student: z.email().describe("The email of the student.").optional(),
});

export const UpdateSubmissionHistorySchema = z.object({
    student: z.email().describe("The email of the student."),
    hasViewed: z.boolean().describe("Whether the student has viewed the submission."),
});
export const RegradeRequestSchema = z.object({
    questionText: z.string().describe("The text of the question to regrade."),
    questionIsRegrade: z.boolean().describe("Whether the question is a regrade.").optional(),
});

export const TestResultsResponseSchema = z.object({
    submissionTests: z.array(SubmissionTestSchema).describe("The submission tests."),
    logs: z.string().describe("The logs for this test run."),
});
export const PartnerLinkResponseSchema = z.object({
    id: z.number().describe("The unique ID of the submission."),
    token: z.string().describe("The token for the partner link."),
});
export const QueryPartnerLinkSchema = z.object({
    token: z.string().describe("The token for the partner link."),
});
