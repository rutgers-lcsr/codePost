import { z } from "zod";
import {
    AnonymousSubmissionSchema,
    PartnerLinkResponseSchema,
    QueryPartnerLinkSchema,
    QuerySubmissionHistorySchema,
    RegradeRequestSchema,
    StudentSubmissionSchema,
    StudentSubmissionWithoutGradeSchema,
    SubmissionHistorySchema,
    SubmissionListSchema,
    SubmissionModelSchema,
    SubmissionSchema,
    SubmissionsPermisionsSchema,
    SubmissionStatusSchema,
    SubmissionWithoutFilesSchema,
    SubmissionWithTestsSchema,
    TestResultsResponseSchema,
    UpdateSubmissionHistorySchema,
} from "./schema";

export type SubmissionModel = z.infer<typeof SubmissionModelSchema>;
export type SubmissionWithoutFiles = z.infer<
    typeof SubmissionWithoutFilesSchema
>;
export type Submission = z.infer<typeof SubmissionSchema>;
export type AnonymousSubmission = z.infer<typeof AnonymousSubmissionSchema>;
export type StudentSubmission = z.infer<typeof StudentSubmissionSchema>;
export type SubmissionStatus = z.infer<typeof SubmissionStatusSchema>;
export type StudentSubmissionWithoutGrade = z.infer<
    typeof StudentSubmissionWithoutGradeSchema
>;
export type SubmissionWithTests = z.infer<typeof SubmissionWithTestsSchema>;
export type SubmissionList = z.infer<typeof SubmissionListSchema>;
export type SubmissionPermissions = z.infer<typeof SubmissionsPermisionsSchema>;
export type SubmissionHistory = z.infer<typeof SubmissionHistorySchema>;
export type SubmissionHistoryQuery = z.infer<
    typeof QuerySubmissionHistorySchema
>;
export type UpdateSubmissionHistory = z.infer<
    typeof UpdateSubmissionHistorySchema
>;
export type RegradeRequest = z.infer<typeof RegradeRequestSchema>;
export type TestResultsResponse = z.infer<typeof TestResultsResponseSchema>;
export type PartnerLinkResponse = z.infer<typeof PartnerLinkResponseSchema>;
export type QueryPartnerLink = z.infer<typeof QueryPartnerLinkSchema>;
