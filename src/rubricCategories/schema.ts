import z from "zod";

// Double check this
const RubricCategoryBaseSchema = z.object({
    id: z.number(),
    assignment: z.number(),
    name: z.string(),
    pointLimit: z.number(),
    rubricComments: z.array(z.number()),
    sortKey: z.string(),
    atMostOnce: z.boolean(),
});

export const RubricCategorySchema = RubricCategoryBaseSchema.extend({
    helpText: z.string(),
});
export const RubricCategoryStudentSchema = RubricCategoryBaseSchema;
