import z from "zod";
import {
    CommentBasicSchema,
    CommentModelSchema,
    CommentSerializerSchema,
    FeedbackSchema,
} from "./schema";

export type Comment = z.infer<typeof CommentModelSchema>;
export type CommentSerializer = z.infer<typeof CommentSerializerSchema>;
export type CommentBasic = z.infer<typeof CommentBasicSchema>;
export type Feedback = z.infer<typeof FeedbackSchema>;
