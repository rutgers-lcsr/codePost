import { z } from "zod";

export const FileTemplateModelSchema = z.object({
    name: z.string().max(150).describe("The name of the template file."),
    code: z.string().optional().describe("The code in a file."),
    extension: z
        .string()
        .max(36)
        .describe("The extension for the file (e.g. '.java' or '.py')"),
    path: z
        .string()
        .max(500)
        .nullable()
        .optional()
        .describe(
            "Optional file path, delimited by slashes, to indicate a directory structure in submission.",
        ),
    assignment: z.number().int().describe("The related assignment_id."),
    required: z
        .boolean()
        .default(false)
        .describe(
            "If student upload is enabled, a file with this name and extension will be required.",
        ),
    description: z
        .string()
        .optional()
        .describe("Optional description shown to students."),
});

export const FileTemplateSchema = z.object({
    id: z.number().int(),
    name: z.string().max(150),
    code: z.string().optional(),
    extension: z.string().max(36),
    path: z.string().max(500).nullable().optional(),
    assignment: z.number().int(),
    required: z.boolean().default(false),
    description: z.string().optional(),
});
