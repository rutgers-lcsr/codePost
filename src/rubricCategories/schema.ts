import z from "zod";

const RubricCategoryBaseSchema = z.object({
    id: z.number(),
    assignment: z.number(),
    name: z.string().max(72),
    pointLimit: z.number().int().nullable().optional(),
    rubricComments: z.array(z.number()).optional(),
    sortKey: z.number().int().default(0),
    atMostOnce: z.boolean().default(false),
});

export const RubricCategorySchema = RubricCategoryBaseSchema.extend({
    helpText: z.string().optional(),
});
export const RubricCategoryStudentSchema = RubricCategoryBaseSchema;
