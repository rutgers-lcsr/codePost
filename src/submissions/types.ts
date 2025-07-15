import { z } from "zod";
import {
    PartnerLinkResponseSchema,
    QueryPartnerLinkSchema,
    QuerySubmissionHistorySchema,
    RegradeRequestSchema,
    StudentSubmissionSchema,
    SubmissionHistorySchema,
    SubmissionListSchema,
    SubmissionSchema,
    SubmissionsPermisionsSchema,
    SubmissionTestSchema,
    TestResultsResponseSchema,
    UpdateSubmissionHistorySchema,
} from "./schema";

export type Submission = z.infer<typeof SubmissionSchema>;
export type StudentSubmission = z.infer<typeof StudentSubmissionSchema>;
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
export type SubmissionTest = z.infer<typeof SubmissionTestSchema>;
export type TestResultsResponse = z.infer<typeof TestResultsResponseSchema>;
export type PartnerLinkResponse = z.infer<typeof PartnerLinkResponseSchema>;
export type QueryPartnerLink = z.infer<typeof QueryPartnerLinkSchema>;
