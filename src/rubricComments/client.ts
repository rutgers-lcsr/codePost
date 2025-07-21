import { CodePostHTTP } from "../http";
import { BasicFunctions } from "../api";
import {
    CommentsResponse,
    FeedbackScoreResponse,
    RubricComment,
} from "./types";
import { RubricCommentSchema } from "./schema";

export const RubricComments = {
    ...BasicFunctions<RubricComment>("/rubricComments", RubricCommentSchema),
    getComments: async (rubricCommentId: number) => {
        return await CodePostHTTP.get<CommentsResponse>(
            `/rubricComments/${rubricCommentId}/comments/`,
        );
    },
    getFeedbackScore: async (rubricCommentId: number) => {
        return await CodePostHTTP.get<FeedbackScoreResponse>(
            `/rubricComments/${rubricCommentId}/feedbackScore/`,
        );
    },
};
