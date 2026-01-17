import z from "zod";

export const CommentTemplateSchema = z.object({
    id: z.number(),
    text: z.string(),
    owner: z.string(), // email
    assignment: z.number(),
    isGlobal: z.boolean(),
    cellId: z.string().nullable().optional(),
    filePath: z.string().nullable().optional(),
    pointDelta: z.number().nullable().optional(),
    rubricComment: z.number().nullable().optional(),
    sourceComment: z.number().nullable().optional(),
});
