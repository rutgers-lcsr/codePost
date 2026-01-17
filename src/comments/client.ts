import { BasicFunctions } from "../api/utils";
import { CodePostHTTP } from "../http";
import { CommentModelSchema } from "./schema";
import { Comment, CommentBasic, CommentSerializer, Feedback } from "./types";

export const Comments = {
    ...BasicFunctions<Comment>("/comments", CommentModelSchema),
    retrieve: async (commentId: number) => await CodePostHTTP.get<CommentSerializer | CommentBasic>(`/comments/${commentId}/`),
    feedback: async (commentId: number, feedback: string) => {
        await CodePostHTTP.patch<CommentBasic, Feedback>(`/comments/${commentId}/feedback`, {
            feedback,
        });
    },
};
