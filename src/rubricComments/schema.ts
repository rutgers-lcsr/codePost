import z from "zod";

export const RubricCommentSchema = z.object({
    id: z.number(),
    text: z.string(),
    pointDelta: z.number(),
    category: z.number(),
    sortKey: z.string(),
    explanation: z.string(),
    instructionText: z.string(),
    templateTextOn: z.boolean(),
    name: z.string(),
});

export const CommentsResponseSchema = z.object({
    id: z.number(),
    comments: z.array(z.number()),
});

export const FeedbackScoreSchema = z.object({
    id: z.number(),
    negative: z.number(),
    positive: z.number(),
});
