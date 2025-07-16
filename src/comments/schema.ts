import z from "zod";

export const CommentModelSchema = z.object({
    id: z.number(),
    text: z.string(),
    pointDelta: z.number().max(999.99).nullable(),
    rubricComment: z.number().nullable(),
    author: z.string(),
    file: z.number(),
    startChar: z.number(),
    endChar: z.number(),
    startLine: z.number(),
    endLine: z.number(),
    feedback: z.number().default(0),
    color: z.string().max(7).nullable(),
    tags: z.array(z.string()),
    course: z.number(),
});

export const CommentSerializerSchema = z.object({
    id: z.number(),
    text: z.string(),
    pointDelta: z.number().nullable(),
    startChar: z.number().nullable().optional(),
    endChar: z.number().nullable().optional(),
    startLine: z.number(),
    endLine: z.number().nullable().optional(),
    file: z.number(),
    rubricComment: z.number().nullable(),
    author: z.email().nullable(),
    feedback: z.number().nullable().optional(),
    color: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
});

export const CommentBasicSchema = CommentSerializerSchema.omit({
    author: true,
    color: true,
});

export const FeedbackSchema = z.object({
    feedback: z.string(),
});
