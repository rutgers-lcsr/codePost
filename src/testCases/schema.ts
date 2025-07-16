import { z } from "zod";

export const testTypes = [
    "io",
    "io_cli",
    "unit",
    "shell",
    "file",
    "external",
] as const;
export const testCaseStatusTypes = [
    { value: 0, label: "Passed" },
    { value: 1, label: "Failed" },
    { value: 2, label: "Error" },
    { value: 3, label: "Never run" },
] as const;

export const TestCaseModelSchema = z.object({
    id: z.number(),
    testCategory: z.number().int().describe("The related testCategory__id."),
    sortKey: z
        .number()
        .int()
        .default(0)
        .describe("Integer to specify the order of a Assignment's Tests."),
    description: z.string().max(48).describe("Test description."),
    type: z.enum(testTypes).describe("Test type."),
    pointsFail: z
        .number()
        .max(999.99)
        .default(0)
        .describe("The points assigned to a failed test."),
    pointsPass: z
        .number()
        .max(999.99)
        .default(0)
        .describe("The points assigned to a passed test."),
    text: z.string().optional().describe("The text of the test"),
    explanation: z
        .string()
        .optional()
        .describe("A description of what the test achieves"),
    exposed: z
        .boolean()
        .default(false)
        .describe(
            "If True and type is not 'external', this test will be run when a student submits, and the results shown to the student",
        ),
    lastSolutionRun: z
        .number()
        .int()
        .default(3)
        .describe("Status of the last solution run."),
    function: z.string().optional().describe("The function name to test"),
    fileName: z.string().optional().describe("The file name to test"),
    outputIsFile: z
        .boolean()
        .default(false)
        .describe(
            "A boolean field. 'True' if the output is the name of a file to be compared to.",
        ),
    expectedOutput: z
        .string()
        .optional()
        .describe("The expected output of the test"),
    input: z.string().optional().describe("The input of the test"),
    checkReturn: z
        .boolean()
        .default(true)
        .describe(
            "A boolean field. 'True' if the output should be compared to the return of the function. False if it should be compared to std out.",
        ),
    isFlexible: z
        .boolean()
        .default(false)
        .describe("Flexible mode for output checking."),
    outputIsRegexp: z
        .boolean()
        .default(false)
        .describe("Is expected output specified in the form of a regexp?"),
    course: z.number().int().describe("The related course__id."),
});

export const TestCaseSchema = z.object({
    id: z.number(),
    testCategory: z.number().int(),
    sortKey: z.number().int().default(0),
    description: z.string().max(48),
    type: z.enum(testTypes),
    pointsFail: z.number().default(0),
    pointsPass: z.number().default(0),
    text: z.string().optional(),
    modified: z.any().optional(),
    function: z.string().optional(),
    fileName: z.string().optional(),
    outputIsFile: z.boolean().default(false),
    expectedOutput: z.string().optional(),
    input: z.string().optional(),
    checkReturn: z.boolean().default(true),
    exposed: z.boolean().default(false),
    instances: z.any().optional(),
    explanation: z.string().optional(),
    lastSolutionRun: z.number().int().default(3),
    isFlexible: z.boolean().default(false),
    outputIsRegexp: z.boolean().default(false),
});
//'id', 'testCategory', 'sortKey', 'description', 'pointsFail', 'pointsPass', 'explanation', 'exposed'
export const TestCaseStudentSchema = TestCaseSchema.omit({
    type: true,
    text: true,
    modified: true,
    function: true,
    fileName: true,
    outputIsFile: true,
    expectedOutput: true,
    input: true,
    checkReturn: true,
    instances: true,
    lastSolutionRun: true,
    isFlexible: true,
    outputIsRegexp: true,
});

export const RunResponseSchema = z.object({
    task: z.string(),
});
