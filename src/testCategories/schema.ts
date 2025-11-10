import z from "zod";

export const TestCategorySchema = z.object({
    id: z.number(),
    name: z.string().max(48),
    testCases: z.array(z.number()).optional(),
    assignment: z.number(),
});
