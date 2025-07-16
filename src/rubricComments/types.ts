import z from "zod";
import {
    CommentsResponseSchema,
    FeedbackScoreResponseSchema,
    RubricCommentSchema,
} from "./schema";

export type RubricComment = z.infer<typeof RubricCommentSchema>;
export type CommentsResponse = z.infer<typeof CommentsResponseSchema>;
export type FeedbackScoreResponse = z.infer<typeof FeedbackScoreResponseSchema>;
