import { z } from "zod";
import {
    AssignmentQueueLengthSchema,
    AssignmentSchema,
    AssignmentSerializerSchema,
    AssignmentSerializerWithStatisticsAndSummarySchema,
    AssignmentSerializerWithStatisticsSchema,
    CommentSerializerSchema,
    QueryAssignmentListSchema,
} from "./schema";

export type Assignment = z.infer<typeof AssignmentSchema>;
export type QueryAssignmentList = z.infer<typeof QueryAssignmentListSchema>;
export type AssignmentSerializer = z.infer<typeof AssignmentSerializerSchema>;
export type AssignmentStudent = z.infer<typeof AssignmentSerializerSchema>;
export type AssignmentSerializerWithStatistics = z.infer<typeof AssignmentSerializerWithStatisticsSchema>;
export type AssignmentSerializerWithStatisticsAndSummary = z.infer<typeof AssignmentSerializerWithStatisticsAndSummarySchema>;

export type CommentSerializer = z.infer<typeof CommentSerializerSchema>;
export type AssignmentQueueLength = z.infer<typeof AssignmentQueueLengthSchema>;
