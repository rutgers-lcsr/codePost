import { z } from "zod";
import {
    AssignmentQueueLengthSchema,
    AssignmentSchema,
    AssignmentSerializerSchema,
    AssignmentSerializerWithStatisticsAndSummarySchema,
    AssignmentSerializerWithStatisticsSchema,
    AssignmentSubmissionedFilesResponseSchema,
    AssignmentSubmissionHistoryQuerySchema,
    AssignmentSubmissionInfoResponseExtendedSchema,
    AssignmentSubmissionInfoResponseSchema,
    AssignmentSubmissionsQuerySchema,
    AssignmentTestsResponseSchema,
    QueryAssignmentListSchema,
    RubricResponseSchema,
    AssignmentSubmissionTestsResponseSchema,
} from "./schema";

export type Assignment = z.infer<typeof AssignmentSchema>;
export type QueryAssignmentList = z.infer<typeof QueryAssignmentListSchema>;
export type AssignmentSerializer = z.infer<typeof AssignmentSerializerSchema>;
export type AssignmentStudent = z.infer<typeof AssignmentSerializerSchema>;
export type AssignmentSerializerWithStatistics = z.infer<
    typeof AssignmentSerializerWithStatisticsSchema
>;
export type AssignmentSerializerWithStatisticsAndSummary = z.infer<
    typeof AssignmentSerializerWithStatisticsAndSummarySchema
>;

export type AssignmentQueueLength = z.infer<typeof AssignmentQueueLengthSchema>;

export type RubricResponse = z.infer<typeof RubricResponseSchema>;

export type AssignmentSubmissionsQuery = z.infer<
    typeof AssignmentSubmissionsQuerySchema
>;
export type AssignmentSubmissionHistoryQuery = z.infer<
    typeof AssignmentSubmissionHistoryQuerySchema
>;

export type AssignmentTestsResponse = z.infer<
    typeof AssignmentTestsResponseSchema
>;
export type AssignmentSubmissionInfoResponse = z.infer<
    typeof AssignmentSubmissionInfoResponseSchema
>;
export type AssignmentSubmissionInfoResponseExtended = z.infer<
    typeof AssignmentSubmissionInfoResponseExtendedSchema
>;

export type AssignmentSubmissionedFilesResponse = z.infer<
    typeof AssignmentSubmissionedFilesResponseSchema
>;

export type AssignmentSubmissionTestsResponse = z.infer<
    typeof AssignmentSubmissionTestsResponseSchema
>;
