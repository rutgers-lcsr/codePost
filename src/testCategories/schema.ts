import z from "zod";

export const TestCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    testCases: z.array(z.number()),
    assignment: z.any(),
});
