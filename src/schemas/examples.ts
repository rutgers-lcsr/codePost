import z from "zod";
import {
    CourseSchema,
    AssignmentSchema,
    SubmissionSchema,
    CommentSchema,
    UserSchema,
    CourseCreateRequestSchema,
    AssignmentCreateRequestSchema,
    SubmissionCreateRequestSchema,
    validateSchema,
    formatValidationErrors,
} from "./index";

// Example 1: Basic schema validation
export function validateCourseData(data: unknown) {
    try {
        const validatedCourse = CourseSchema.parse(data);
        console.log("Valid course:", validatedCourse);
        return validatedCourse;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation errors:", formatValidationErrors(error));
        }
        throw error;
    }
}

// Example 2: Creating a new course with API request schema
export function createCourse(courseData: unknown) {
    const validator = validateSchema(CourseCreateRequestSchema);
    return validator(courseData);
}

// Example 3: Partial updates
export function updateAssignment(id: number, updates: unknown) {
    const UpdateSchema = AssignmentSchema.partial().omit({
        id: true,
        created: true,
        modified: true,
    });

    const validatedUpdates = UpdateSchema.parse(updates);

    // Simulate API call
    return {
        id,
        ...validatedUpdates,
        modified: new Date().toISOString(),
    };
}

// Example 4: Nested validation
export function validateSubmissionWithFiles(submissionData: unknown) {
    const SubmissionWithFilesSchema = SubmissionSchema.extend({
        files: z
            .array(
                z.object({
                    name: z.string(),
                    code: z.string(),
                    extension: z.string(),
                }),
            )
            .optional(),
    });

    return SubmissionWithFilesSchema.parse(submissionData);
}

// Example 5: Custom validation with transform
export function validateAndTransformGrade(grade: unknown) {
    const GradeSchema = z
        .union([z.string().transform((val) => parseFloat(val)), z.number()])
        .refine((val) => val >= 0 && val <= 100, {
            message: "Grade must be between 0 and 100",
        });

    return GradeSchema.parse(grade);
}

// Example 6: Array validation
export function validateStudentEmails(emails: unknown) {
    const EmailArraySchema = z
        .array(z.string().email("Must be a valid email address"))
        .min(1, "At least one email is required");

    return EmailArraySchema.parse(emails);
}

// Example 7: Conditional validation
export function validateComment(commentData: unknown) {
    const ConditionalCommentSchema = CommentSchema.refine(
        (data) => {
            // If rubricComment is provided, pointDelta should be null
            if (data.rubricComment !== null && data.pointDelta !== null) {
                return false;
            }
            return true;
        },
        {
            message: "Cannot have both rubricComment and pointDelta",
            path: ["pointDelta"],
        },
    );

    return ConditionalCommentSchema.parse(commentData);
}

// Example 8: Safe parsing with defaults
export function safeParseUser(userData: unknown) {
    const result = UserSchema.safeParse(userData);

    if (result.success) {
        return result.data;
    } else {
        console.error("User validation failed:", result.error.issues);

        // Return default user structure
        return {
            id: 0,
            username: "unknown",
            email: "unknown@example.com",
            first_name: "",
            last_name: "",
            is_active: false,
            is_staff: false,
            is_superuser: false,
            date_joined: new Date().toISOString(),
            last_login: null,
        };
    }
}

// Example 9: Schema composition
export function createAssignmentWithRubric(assignmentData: unknown) {
    const AssignmentWithRubricSchema = AssignmentSchema.extend({
        rubricCategories: z.array(
            z.object({
                name: z.string(),
                pointLimit: z.number().nullable(),
                rubricComments: z.array(
                    z.object({
                        text: z.string(),
                        pointDelta: z.number(),
                    }),
                ),
            }),
        ),
    });

    return AssignmentWithRubricSchema.parse(assignmentData);
}

// Example 10: API response validation
export function validateApiResponse<T>(
    schema: z.ZodSchema<T>,
    response: unknown,
) {
    const ApiResponseSchema = z.object({
        success: z.boolean(),
        data: schema,
        message: z.string().optional(),
        errors: z.record(z.string(), z.array(z.string())).optional(),
    });

    const result = ApiResponseSchema.safeParse(response);

    if (!result.success) {
        throw new Error(
            `API response validation failed: ${result.error.message}`,
        );
    }

    if (!result.data.success) {
        throw new Error(
            `API request failed: ${result.data.message || "Unknown error"}`,
        );
    }

    return result.data.data;
}

// Example 11: Form validation helper
export function createFormValidator<T>(schema: z.ZodSchema<T>) {
    return {
        validate: (data: unknown) => {
            const result = schema.safeParse(data);
            if (result.success) {
                return { success: true, data: result.data, errors: {} };
            } else {
                return {
                    success: false,
                    data: null,
                    errors: formatValidationErrors(result.error),
                };
            }
        },

        validateField: (fieldName: string, value: unknown) => {
            // Simple field validation - would need more complex logic for nested schemas
            const result = schema.safeParse({ [fieldName]: value });
            return {
                success: result.success,
                error: result.success
                    ? null
                    : result.error?.issues[0]?.message || "Validation failed",
            };
        },
    };
}

// Example usage of form validator
export const assignmentFormValidator = createFormValidator(
    AssignmentCreateRequestSchema,
);

// Example 12: Filtering and searching
export function createSearchParams(params: unknown) {
    const SearchParamsSchema = z.object({
        query: z.string().optional(),
        course: z.number().optional(),
        assignment: z.number().optional(),
        student: z.number().optional(),
        grader: z.number().optional(),
        is_finalized: z.boolean().optional(),
        grade_min: z.number().min(0).optional(),
        grade_max: z.number().min(0).optional(),
        date_from: z.string().datetime().optional(),
        date_to: z.string().datetime().optional(),
        page: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(100).default(20),
        ordering: z
            .enum([
                "created",
                "-created",
                "modified",
                "-modified",
                "grade",
                "-grade",
                "name",
                "-name",
            ])
            .optional(),
    });

    return SearchParamsSchema.parse(params);
}

// Example 13: Batch operations
export function validateBatchSubmissionUpdate(updates: unknown) {
    const BatchUpdateSchema = z.object({
        submissions: z.array(z.number()).min(1),
        updates: z.object({
            grader: z.number().optional(),
            is_finalized: z.boolean().optional(),
            grade: z.number().min(0).optional(),
        }),
    });

    return BatchUpdateSchema.parse(updates);
}

// Example 14: File upload validation
export function validateFileUpload(fileData: unknown) {
    const FileUploadSchema = z.object({
        submission_id: z.number(),
        files: z
            .array(
                z.object({
                    name: z.string().min(1).max(150),
                    content: z.string(),
                    extension: z.string().regex(/^\.[a-zA-Z0-9]+$/),
                    size: z.number().max(10 * 1024 * 1024), // 10MB max
                }),
            )
            .min(1)
            .max(20), // Max 20 files
    });

    return FileUploadSchema.parse(fileData);
}

// Example 15: Environment-specific validation
export function validateForEnvironment(
    env: "development" | "production",
    data: unknown,
) {
    let schema = CourseCreateRequestSchema;

    if (env === "development") {
        // More lenient validation for development
        schema = schema.partial();
    }
    // Production uses the default strict validation

    return schema.parse(data);
}
