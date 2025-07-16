import z from "zod";

// Custom validators
export const hexColorValidator = z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color code");

export const emailDomainValidator = z.email("Must be a valid email address");

export const timezoneValidator = z
    .string()
    .min(1, "Timezone cannot be empty")
    .max(32, "Timezone must be 32 characters or less");

// Custom validation functions
export function validateManualPayments(value: unknown) {
    if (!Array.isArray(value)) {
        throw new Error("Must be an array");
    }

    const requiredFields = [
        "id",
        "timestamp",
        "amount",
        "description",
        "email",
    ];
    for (const item of value) {
        if (!requiredFields.every((field) => field in item)) {
            throw new Error(
                "Each manual payment must have an id, timestamp, amount, description, and email field",
            );
        }
    }
    return value;
}

// File extension validation
export const validFileExtensions = [
    ".java",
    ".py",
    ".js",
    ".ts",
    ".cpp",
    ".c",
    ".h",
    ".hpp",
    ".cs",
    ".rb",
    ".php",
    ".go",
    ".rs",
    ".swift",
    ".kt",
    ".scala",
    ".html",
    ".css",
    ".json",
    ".xml",
    ".md",
    ".txt",
    ".sql",
];

export const fileExtensionValidator = z
    .string()
    .refine(
        (ext) => validFileExtensions.includes(ext.toLowerCase()),
        `File extension must be one of: ${validFileExtensions.join(", ")}`,
    );

// Grade validation
export const gradeValidator = z
    .number()
    .min(0, "Grade cannot be negative")
    .max(1000, "Grade cannot exceed 1000 points");

// Points validation
export const pointsValidator = z
    .number()
    .min(0, "Points cannot be negative")
    .max(1000, "Points cannot exceed 1000");

// Point delta validation (can be negative for bonuses)
export const pointDeltaValidator = z
    .number()
    .min(-1000, "Point delta cannot be less than -1000")
    .max(1000, "Point delta cannot exceed 1000");

// Character position validation
export const charPositionValidator = z
    .number()
    .int("Character position must be an integer")
    .min(0, "Character position cannot be negative");

// Line number validation
export const lineNumberValidator = z
    .number()
    .int("Line number must be an integer")
    .min(1, "Line number must be at least 1");

// Sort key validation
export const sortKeyValidator = z
    .number()
    .int("Sort key must be an integer")
    .min(0, "Sort key cannot be negative");

// Test status validation
export const testStatusValidator = z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
]);

// Language validation
export const languageValidator = z.enum([
    "python-3.7",
    "python-2.7",
    "java",
    "c/c++",
    "javascript",
    "haskell",
    "ocaml",
    "ruby",
    "php",
    "other",
] as const);

// Build type validation
export const buildTypeValidator = z.enum([
    "default",
    "alpine",
    "ubuntu",
    "windows",
] as const);

// Test type validation
export const testTypeValidator = z.enum([
    "io",
    "io_cli",
    "unit",
    "shell",
    "file",
    "external",
] as const);

// Date validation helpers
export const dateTimeValidator = z
    .string()
    .datetime("Must be a valid ISO datetime string");

export const nullableDateTimeValidator = z
    .string()
    .datetime("Must be a valid ISO datetime string")
    .nullable();

// String length validators
export const shortStringValidator = z
    .string()
    .min(1, "Cannot be empty")
    .max(32, "Cannot exceed 32 characters");

export const mediumStringValidator = z
    .string()
    .min(1, "Cannot be empty")
    .max(150, "Cannot exceed 150 characters");

export const longStringValidator = z
    .string()
    .max(500, "Cannot exceed 500 characters");

export const textValidator = z
    .string()
    .max(10000, "Text cannot exceed 10000 characters");

// ID validation
export const idValidator = z
    .number()
    .int("ID must be an integer")
    .positive("ID must be positive");

export const nullableIdValidator = z
    .number()
    .int("ID must be an integer")
    .positive("ID must be positive")
    .nullable();

// Array of IDs validation
export const idArrayValidator = z.array(idValidator).default([]);

// Invite code validation
export const inviteCodeValidator = z
    .string()
    .min(6, "Invite code must be at least 6 characters")
    .max(10, "Invite code cannot exceed 10 characters")
    .regex(/^[A-Za-z0-9]+$/, "Invite code can only contain letters and numbers")
    .nullable();

// Organization shortname validation
export const organizationShortnameValidator = z
    .string()
    .min(1, "Organization shortname cannot be empty")
    .max(12, "Organization shortname cannot exceed 12 characters")
    .regex(
        /^[A-Za-z0-9-_]+$/,
        "Organization shortname can only contain letters, numbers, hyphens, and underscores",
    );

// Course period validation
export const coursePeriodValidator = z
    .string()
    .min(1, "Course period cannot be empty")
    .max(32, "Course period cannot exceed 32 characters")
    .regex(
        /^[A-Za-z0-9\s]+$/,
        "Course period can only contain letters, numbers, and spaces",
    );

// Username validation
export const usernameValidator = z
    .string()
    .min(1, "Username cannot be empty")
    .max(150, "Username cannot exceed 150 characters")
    .regex(
        /^[\w.@+-]+$/,
        "Username can only contain letters, numbers, and @/./+/-/_ characters",
    );

// Email validation with custom message
export const emailValidator = z
    .string()
    .email("Must be a valid email address")
    .max(254, "Email cannot exceed 254 characters");

// Password validation
export const passwordValidator = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters");

// File path validation
export const filePathValidator = z
    .string()
    .max(500, "File path cannot exceed 500 characters")
    .regex(/^[^<>:"|?*\x00-\x1f]*$/, "File path contains invalid characters")
    .nullable();

// Stripe customer ID validation
export const stripeCustomerIdValidator = z
    .string()
    .max(96, "Stripe customer ID cannot exceed 96 characters")
    .regex(/^cus_[A-Za-z0-9]+$/, "Must be a valid Stripe customer ID")
    .nullable();

// JSON field validators
export const jsonObjectValidator = z.record(z.string(), z.any()).default({});

export const jsonArrayValidator = z.array(z.any()).default([]);

// Validation error formatter
export function formatValidationErrors(
    error: z.ZodError,
): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!errors[path]) {
            errors[path] = [];
        }
        errors[path].push(issue.message);
    });

    return errors;
}

// Validation middleware helper
export function validateSchema<T>(schema: z.ZodSchema<T>) {
    return (data: unknown): T => {
        try {
            return schema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = formatValidationErrors(error);
                throw new Error(
                    `Validation failed: ${JSON.stringify(formattedErrors)}`,
                );
            }
            throw error;
        }
    };
}

// Partial validation for updates
export function createUpdateValidator<T extends Record<string, any>>(
    schema: z.ZodObject<any>,
) {
    return schema.partial().omit({
        id: true,
        created: true,
        modified: true,
    });
}

// Safe parse with defaults
export function safeParseWithDefaults<T extends Record<string, any>>(
    schema: z.ZodSchema<T>,
    data: unknown,
    defaults: Partial<T>,
): T {
    const result = schema.safeParse(data);
    if (result.success) {
        return result.data;
    }

    // Apply defaults for missing fields
    const mergedData = { ...defaults, ...(data as Record<string, any>) };
    return schema.parse(mergedData);
}
