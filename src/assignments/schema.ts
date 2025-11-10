import { z } from "zod";
import { QueryListParamsSchema, QueryResponseSchemaBase } from "../api";
import { TestCaseSchema } from "../testCases";
import { TestCategorySchema } from "../testCategories";
import { FileStudentUploadSchema } from "../files";
import { SubmissionsTestSchema, SubmissionWithTestsSchema } from "../submissions";
import { RubricCategorySchema, RubricCategoryStudentSchema } from "../rubricCategories";
import { RubricCommentSchema } from "../rubricComments";
//rubricCategories, environment, fileTemplates, maxStudentTestRuns, exposeDumpLogs, nudgeMode,
export const AssignmentSchema = z.object({
    id: z.number(),
    name: z.string().max(32),
    isReleased: z.boolean().default(false),
    course: z.number(),

    allowStudentUpload: z.boolean().default(false),
    allowStudentUploadWithPartners: z.boolean().default(false),
    uploadDueDate: z.iso.datetime().nullable().optional(),
    maxLateDays: z.number().default(2),
    liveFeedbackMode: z.boolean().default(false),
    allowLateUploads: z.boolean().default(false),

    explanation: z.string().optional(),
    isVisible: z.boolean().default(true),
    hideFrom: z.array(z.number()).optional(), // Section IDs

    lateDeductions: z.array(z.any()).default([]),

    points: z.number().min(0),
    mean: z.number().min(0).nullable().optional(),
    median: z.number().min(0).nullable().optional(),
    sortKey: z.number().default(0),
    hideGrades: z.boolean().default(false),
    anonymousGrading: z.boolean().default(false),
    commentFeedback: z.boolean().default(true),
    additiveGrading: z.boolean().default(false),
    hideGradersFromStudents: z.boolean().default(true),
    collaborativeRubricMode: z.boolean().default(false),
    allowRegradeRequests: z.boolean().default(false),
    regradeInstructions: z.string().optional(),
    regradeDeadline: z.iso.datetime().nullable().optional(),
    forcedRubricMode: z.boolean().default(false),
    templateMode: z.boolean().default(false),
    showFrequentlyUsedRubricComments: z.boolean().default(false),
});

export const QueryAssignmentListSchema = QueryResponseSchemaBase.extend({
    results: z.array(AssignmentSchema),
});

export const AssignmentBaseSchema = z.object({
    id: z.number(),
    name: z.string().max(32),
    isReleased: z.boolean().default(false),
    course: z.number(),

    allowStudentUpload: z.boolean().default(false),
    allowStudentUploadWithPartners: z.boolean().default(false),
    uploadDueDate: z.iso.datetime().nullable().optional(),
    maxLateDays: z.number().default(2),
    liveFeedbackMode: z.boolean().default(false),
    allowLateUploads: z.boolean().default(false),

    explanation: z.string().optional(),
    isVisible: z.boolean().default(true),
    hideFrom: z.array(z.number()).optional(), // Section IDs

    lateDeductions: z.array(z.any()).default([]),
});

export const AssignmentSerializerBaseSchema = AssignmentBaseSchema.extend({
    rubricCategories: z.array(z.any()).optional(),
    environment: z.any().optional(),
    fileTemplates: z.array(z.any()).optional(),
    maxStudentTestRuns: z.number().nullable().optional(),
    exposeDumpLogs: z.boolean().nullable().optional(),
    nudgeMode: z.boolean().optional(),
    lateDeductions: z.array(z.number()).default([]),
});

export const AssignmentStudentSchema = AssignmentSerializerBaseSchema.extend({});

export const AssignmentSerializerSchema = AssignmentSerializerBaseSchema.extend({
    points: z.number().min(0),
    hideGrades: z.boolean().default(false),
    sortKey: z.number().default(0),
    anonymousGrading: z.boolean().default(false),
    hideGradersFromStudents: z.boolean().default(true),
    commentFeedback: z.boolean().default(true),
    additiveGrading: z.boolean().default(false),
    allowRegradeRequests: z.boolean().default(false),
    regradeInstructions: z.string().optional(),
    regradeDeadline: z.iso.datetime().nullable().optional(),
    forcedRubricMode: z.boolean().default(false),
    templateMode: z.boolean().default(false),
    collaborativeRubricMode: z.boolean().default(false),
    testCategories: z.array(z.any()).optional(),
    showFrequentlyUsedRubricComments: z.boolean().default(false),
});

export const AssignmentSerializerWithStatisticsSchema = AssignmentSerializerSchema.extend({
    mean: z.number().min(0).nullable().optional(),
    median: z.number().min(0).nullable().optional(),
});

export const AssignmentSerializerWithStatisticsAndSummarySchema = AssignmentSerializerWithStatisticsSchema.extend({
    submissions_count: z.number().optional(),
    submissions_finalized_count: z.number().optional(),
    submissions_inprogress_count: z.number().optional(),
    submissions_unclaimed_count: z.number().optional(),
    submissions_missing_count: z.number().optional(),
    stats_max: z.number().optional(),
    stats_min: z.number().optional(),
    stats_mean: z.number().optional(),
});

export const AssignmentQueueLengthSchema = z.object({
    id: z.number(),
    unclaimed: z.number(),
    finialized: z.number(),
    unfinialized: z.number(),
});

export const RubricResponseSchema = z.object({
    id: z.number(),
    rubricCategories: z.array(RubricCategoryStudentSchema).or(z.array(RubricCategorySchema)),
    rubricComments: z.array(RubricCommentSchema),
});

export const AssignmentSubmissionsQuerySchema = QueryListParamsSchema.extend({
    student: z.string().optional(),
    grader: z.string().optional(),
    compact: z.boolean().optional(),
}).omit({
    page_size: true,
});
export const AssignmentSubmissionHistoryQuerySchema = QueryListParamsSchema.omit({
    page_size: true,
});

export const AssignmentTestsResponseSchema = z.object({
    id: z.number(),
    testCases: z.array(TestCaseSchema),
    TestCategories: z.array(TestCategorySchema),
});

export const AssignmentSubmissionInfoResponseSchema = z.object({
    daysLate: z.number(),
    pointsOff: z.number(),
});

export const AssignmentSubmissionInfoResponseExtendedSchema = AssignmentSubmissionInfoResponseSchema.extend({
    lateDayCreditsAvailable: z.number(),
    lateDayCreditsToUse: z.number(),
    adjustedDaysLate: z.number(),
});

export const AssignmentSubmissionedFilesResponseSchema = z.object({
    id: z.number(),
    files: z.array(FileStudentUploadSchema),
});

export const AssignmentSubmissionTestsResponseSchema = SubmissionWithTestsSchema.or(
    QueryResponseSchemaBase.extend({
        results: SubmissionWithTestsSchema,
    })
);
