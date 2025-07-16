import { BasicFunctions } from "../api";
import { CodePostHTTP } from "../http";
import { CommentModelSchema } from "./schema";
import { Comment, CommentBasic, CommentSerializer, Feedback } from "./types";

export const Comments = {
    ...BasicFunctions<Comment>("/comments", CommentModelSchema),
    retrieve: async (commentId: string) =>
        await CodePostHTTP.get<CommentSerializer | CommentBasic>(
            `/comments/${commentId}/`,
        ),
    feedback: async (commentId: string, feedback: string) => {
        await CodePostHTTP.patch<CommentBasic, Feedback>(
            `/comments/${commentId}/feedback`,
            {
                feedback,
            },
        );
    },
};
