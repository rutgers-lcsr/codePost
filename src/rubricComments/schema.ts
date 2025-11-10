import z from "zod";

export const RubricCommentSchema = z.object({
    id: z.number(),
    text: z.string(),
    pointDelta: z.number(),
    category: z.number(),
    sortKey: z.number().default(0),
    explanation: z.string().optional(),
    instructionText: z.string().optional(),
    templateTextOn: z.boolean().default(false),
    name: z.string().nullable().optional(),
});

export const CommentsResponseSchema = z.object({
    id: z.number(),
    comments: z.array(z.number()),
});

export const FeedbackScoreResponseSchema = z.object({
    id: z.number(),
    negative: z.number(),
    positive: z.number(),
});
