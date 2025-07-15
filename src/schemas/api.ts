import z from "zod";
import {
    AssignmentSchema,
    CourseSchema,
    SubmissionSchema,
    UserSchema,
    FileSchema,
    CommentSchema,
    RubricCategorySchema,
    RubricCommentSchema,
    TestCaseSchema,
    TestCategorySchema,
    EnvironmentSchema,
    SectionSchema,
    OrganizationSchema,
    ProfileSchema,
    SubmissionTestSchema,
    FileTemplateSchema,
    CommentTagSchema,
    SubmissionHistorySchema,
    WebhookSchema,
} from "../types";

// Common API response wrapper
export const ApiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
    z.object({
        success: z.boolean(),
        data: dataSchema,
        message: z.string().optional(),
        errors: z.record(z.string(), z.array(z.string())).optional(),
    });

export const ApiErrorSchema = z.object({
    success: z.literal(false),
    message: z.string(),
    errors: z.record(z.string(), z.array(z.string())).optional(),
    status: z.number().optional(),
});

// Pagination schema
export const PaginationSchema = z.object({
    count: z.number(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(z.unknown()),
});

export const PaginatedResponseSchema = <T>(itemSchema: z.ZodSchema<T>) =>
    z.object({
        count: z.number(),
        next: z.string().url().nullable(),
        previous: z.string().url().nullable(),
        results: z.array(itemSchema),
    });

// Auth schemas
export const LoginRequestSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export const LoginResponseSchema = z.object({
    token: z.string(),
    user: UserSchema,
});

export const RegisterRequestSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    organization: z.number().optional(),
});

export const TokenRefreshRequestSchema = z.object({
    token: z.string(),
});

export const TokenRefreshResponseSchema = z.object({
    token: z.string(),
});

export const PasswordResetRequestSchema = z.object({
    email: z.string().email("Valid email is required"),
});

export const PasswordResetConfirmSchema = z.object({
    token: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

// User API schemas
export const UserListResponseSchema = PaginatedResponseSchema(UserSchema);

export const UserCreateRequestSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
});

export const UserUpdateRequestSchema = z.object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    is_active: z.boolean().optional(),
});

export const UserProfileUpdateRequestSchema = z.object({
    canCreateCourses: z.boolean().optional(),
    canModifyRosters: z.boolean().optional(),
    showProductTips: z.boolean().optional(),
    organization: z.number().optional(),
});

// Course API schemas
export const CourseListResponseSchema = PaginatedResponseSchema(CourseSchema);

export const CourseCreateRequestSchema = z.object({
    name: z.string().min(1, "Course name is required").max(36),
    organization: z.number(),
    period: z.string().min(1, "Period is required").max(32),
    timezone: z.string().default("US/Eastern"),
    sendReleasedSubmissionsToBack: z.boolean().default(false),
    showStudentsStatistics: z.boolean().default(false),
    emailNewUsers: z.boolean().default(false),
    anonymousGradingDefault: z.boolean().default(false),
    allowGradersToEditRubric: z.boolean().default(false),
    minComments: z.number().int().min(0).default(0),
    noUnfinalize: z.boolean().default(false),
    lateDayCreditsAllowable: z.number().int().min(0).nullable().default(null),
    activateQueue: z.boolean().default(true),
    emailWhitelist: z.string().default(""),
    inviteCodeEnabled: z.boolean().default(false),
    enableStudentFeedbackNotifications: z.boolean().default(false),
});

export const CourseUpdateRequestSchema = CourseCreateRequestSchema.partial();

export const CourseRosterUpdateRequestSchema = z.object({
    students: z.array(z.string().email()).optional(),
    graders: z.array(z.string().email()).optional(),
    superGraders: z.array(z.string().email()).optional(),
    courseAdmins: z.array(z.string().email()).optional(),
    inactive_students: z.array(z.string().email()).optional(),
    inactive_graders: z.array(z.string().email()).optional(),
    inactive_courseAdmins: z.array(z.string().email()).optional(),
});

export const CourseInviteRequestSchema = z.object({
    emails: z.array(z.string().email()),
    role: z.enum(["student", "grader", "superGrader", "courseAdmin"]),
    sections: z.array(z.number()).optional(),
});

// Assignment API schemas
export const AssignmentListResponseSchema =
    PaginatedResponseSchema(AssignmentSchema);

export const AssignmentCreateRequestSchema = z.object({
    name: z.string().min(1, "Assignment name is required").max(32),
    course: z.number(),
    points: z.number().min(0, "Points cannot be negative"),
    isVisible: z.boolean().default(true),
    isReleased: z.boolean().default(false),
    explanation: z.string().default(""),
    hideFrom: z.array(z.number()).default([]),
    sortKey: z.number().int().default(0),
    hideGrades: z.boolean().default(false),
    anonymousGrading: z.boolean().default(false),
    commentFeedback: z.boolean().default(true),
    allowStudentUpload: z.boolean().default(false),
    allowStudentUploadWithPartners: z.boolean().default(false),
    uploadDueDate: z.string().datetime().nullable().default(null),
    liveFeedbackMode: z.boolean().default(false),
    additiveGrading: z.boolean().default(false),
    hideGradersFromStudents: z.boolean().default(true),
    collaborativeRubricMode: z.boolean().default(false),
    allowRegradeRequests: z.boolean().default(false),
    regradeInstructions: z.string().default(""),
    regradeDeadline: z.string().datetime().nullable().default(null),
    forcedRubricMode: z.boolean().default(false),
    templateMode: z.boolean().default(false),
    showFrequentlyUsedRubricComments: z.boolean().default(false),
    allowLateUploads: z.boolean().default(false),
    lateDeductions: z.array(z.number()).default([]),
});

export const AssignmentUpdateRequestSchema =
    AssignmentCreateRequestSchema.partial().omit({
        course: true,
    });

export const AssignmentStatisticsResponseSchema = z.object({
    assignment: AssignmentSchema,
    submissions_count: z.number(),
    submissions_finalized_count: z.number(),
    submissions_inprogress_count: z.number(),
    submissions_unclaimed_count: z.number(),
    submissions_missing_count: z.number(),
    grade_distribution: z.record(z.string(), z.number()),
    stats_max: z.number().nullable(),
    stats_min: z.number().nullable(),
    stats_mean: z.number().nullable(),
    stats_median: z.number().nullable(),
});

// Submission API schemas
export const SubmissionListResponseSchema =
    PaginatedResponseSchema(SubmissionSchema);

export const SubmissionCreateRequestSchema = z.object({
    assignment: z.number(),
    students: z.array(z.number()).min(1, "At least one student is required"),
    grader: z.number().optional(),
    queueOrderKey: z.number().int().default(0),
    lateDayCreditsUsed: z.number().int().min(0).default(0),
});

export const SubmissionUpdateRequestSchema = z.object({
    students: z.array(z.number()).optional(),
    grader: z.number().nullable().optional(),
    isFinalized: z.boolean().optional(),
    grade: z.number().min(0).nullable().optional(),
    gradeFrozen: z.boolean().optional(),
    queueOrderKey: z.number().int().optional(),
    lateDayCreditsUsed: z.number().int().min(0).optional(),
    questionText: z.string().max(500).optional(),
    questionResponse: z.string().optional(),
    questionIsRegrade: z.boolean().optional(),
});

export const SubmissionClaimRequestSchema = z.object({
    assignment: z.number(),
    grader: z.number().optional(),
});

export const SubmissionReleaseRequestSchema = z.object({
    submission: z.number(),
});

export const SubmissionFinalizeRequestSchema = z.object({
    submission: z.number(),
});

export const SubmissionUnfinalizeRequestSchema = z.object({
    submission: z.number(),
});

// File API schemas
export const FileListResponseSchema = PaginatedResponseSchema(FileSchema);

export const FileCreateRequestSchema = z.object({
    name: z.string().min(1, "File name is required").max(150),
    code: z.string(),
    submission: z.number(),
    extension: z.string().max(36),
    path: z.string().max(500).nullable().default(null),
    hiddenBeforePublish: z.boolean().default(false),
});

export const FileUpdateRequestSchema = FileCreateRequestSchema.partial().omit({
    submission: true,
});

export const FileUploadRequestSchema = z.object({
    submission: z.number(),
    files: z.array(
        z.object({
            name: z.string().min(1, "File name is required").max(150),
            content: z.string(),
            extension: z.string().max(36),
            path: z.string().max(500).nullable().default(null),
        }),
    ),
});

// Comment API schemas
export const CommentListResponseSchema = PaginatedResponseSchema(CommentSchema);

export const CommentCreateRequestSchema = z.object({
    text: z.string().default(""),
    pointDelta: z.number().nullable().default(null),
    rubricComment: z.number().nullable().default(null),
    author: z.number(),
    file: z.number(),
    startChar: z.number().int().min(0),
    endChar: z.number().int().min(0),
    startLine: z.number().int().min(1),
    endLine: z.number().int().min(1),
    color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/)
        .nullable()
        .default(null),
    tags: z.array(z.number()).default([]),
});

export const CommentUpdateRequestSchema =
    CommentCreateRequestSchema.partial().omit({
        author: true,
        file: true,
    });

export const CommentFeedbackRequestSchema = z.object({
    comment: z.number(),
    feedback: z.number().int().min(0).max(5),
});

// Rubric API schemas
export const RubricCategoryCreateRequestSchema = z.object({
    assignment: z.number(),
    name: z.string().min(1, "Category name is required").max(72),
    pointLimit: z.number().int().nullable().default(null),
    sortKey: z.number().int().default(0),
    helpText: z.string().default(""),
    atMostOnce: z.boolean().default(false),
});

export const RubricCategoryUpdateRequestSchema =
    RubricCategoryCreateRequestSchema.partial().omit({
        assignment: true,
    });

export const RubricCommentCreateRequestSchema = z.object({
    text: z.string().default(""),
    explanation: z.string().default(""),
    instructionText: z.string().default(""),
    templateTextOn: z.boolean().default(false),
    pointDelta: z.number(),
    category: z.number(),
    sortKey: z.number().int().default(0),
    name: z.string().max(255).nullable().default(null),
});

export const RubricCommentUpdateRequestSchema =
    RubricCommentCreateRequestSchema.partial().omit({
        category: true,
    });

// Test API schemas
export const TestCategoryCreateRequestSchema = z.object({
    assignment: z.number(),
    name: z.string().min(1, "Category name is required").max(48),
});

export const TestCategoryUpdateRequestSchema =
    TestCategoryCreateRequestSchema.partial().omit({
        assignment: true,
    });

export const TestCaseCreateRequestSchema = z.object({
    testCategory: z.number(),
    sortKey: z.number().int().default(0),
    description: z.string().min(1, "Description is required").max(48),
    type: z.enum(["io", "io_cli", "unit", "shell", "file", "external"]),
    pointsFail: z.number().default(0),
    pointsPass: z.number().default(0),
    text: z.string().default(""),
    explanation: z.string().default(""),
    exposed: z.boolean().default(false),
    // IO Test specific fields
    function: z.string().default(""),
    fileName: z.string().default(""),
    outputIsFile: z.boolean().default(false),
    expectedOutput: z.string().default(""),
    input: z.string().default(""),
    checkReturn: z.boolean().default(true),
    isFlexible: z.boolean().default(false),
    outputIsRegexp: z.boolean().default(false),
});

export const TestCaseUpdateRequestSchema =
    TestCaseCreateRequestSchema.partial().omit({
        testCategory: true,
    });

export const TestRunRequestSchema = z.object({
    submission: z.number(),
    testCases: z.array(z.number()).optional(),
    exposed_only: z.boolean().default(false),
});

export const TestRunResponseSchema = z.object({
    submission: z.number(),
    tests: z.array(SubmissionTestSchema),
    status: z.enum(["running", "completed", "failed"]),
    message: z.string().optional(),
});

// Environment API schemas
export const EnvironmentCreateRequestSchema = z.object({
    assignment: z.number(),
    dockerRunInstructions: z.array(z.string()).default([]),
    language: z
        .enum([
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
        ])
        .default("python-3.7"),
    buildType: z
        .enum(["default", "alpine", "ubuntu", "windows"])
        .default("default"),
    dockerfile: z.string().default(""),
    compileText: z.string().default(""),
    dumpMode: z.boolean().default(false),
    testParsing: z.boolean().default(true),
    allowNetworkAccess: z.boolean().default(false),
    maxStudentTestRuns: z.number().int().min(0).nullable().default(null),
    exposeDumpLogs: z.boolean().default(false),
    maxExposedFailedTests: z.number().int().min(0).nullable().default(null),
});

export const EnvironmentUpdateRequestSchema =
    EnvironmentCreateRequestSchema.partial().omit({
        assignment: true,
    });

// Section API schemas
export const SectionCreateRequestSchema = z.object({
    name: z.string().min(1, "Section name is required").max(16),
    course: z.number(),
    leaders: z.array(z.number()).default([]),
    students: z.array(z.number()).default([]),
});

export const SectionUpdateRequestSchema =
    SectionCreateRequestSchema.partial().omit({
        course: true,
    });

// Organization API schemas
export const OrganizationCreateRequestSchema = z.object({
    name: z.string().min(1, "Organization name is required").max(64),
    shortname: z.string().min(1, "Shortname is required").max(12),
});

export const OrganizationUpdateRequestSchema =
    OrganizationCreateRequestSchema.partial();

// Webhook API schemas
export const WebhookCreateRequestSchema = z.object({
    url: z.string().url("Must be a valid URL"),
    events: z.array(z.string()).min(1, "At least one event is required"),
    active: z.boolean().default(true),
    secret: z.string().optional(),
});

export const WebhookUpdateRequestSchema = WebhookCreateRequestSchema.partial();

// Bulk operation schemas
export const BulkSubmissionUpdateRequestSchema = z.object({
    submissions: z
        .array(z.number())
        .min(1, "At least one submission is required"),
    update: SubmissionUpdateRequestSchema,
});

export const BulkCommentCreateRequestSchema = z.object({
    comments: z
        .array(CommentCreateRequestSchema)
        .min(1, "At least one comment is required"),
});

export const BulkGradeUpdateRequestSchema = z.object({
    submissions: z
        .array(
            z.object({
                id: z.number(),
                grade: z.number().min(0).nullable(),
                isFinalized: z.boolean().optional(),
            }),
        )
        .min(1, "At least one submission is required"),
});

// Search and filter schemas
export const SubmissionFilterSchema = z.object({
    assignment: z.number().optional(),
    course: z.number().optional(),
    students: z.array(z.number()).optional(),
    grader: z.number().optional(),
    isFinalized: z.boolean().optional(),
    grade_min: z.number().optional(),
    grade_max: z.number().optional(),
    date_uploaded_after: z.string().datetime().optional(),
    date_uploaded_before: z.string().datetime().optional(),
    has_question: z.boolean().optional(),
    ordering: z
        .enum([
            "created",
            "-created",
            "grade",
            "-grade",
            "dateUploaded",
            "-dateUploaded",
        ])
        .optional(),
    page: z.number().int().min(1).optional(),
    page_size: z.number().int().min(1).max(100).optional(),
});

export const AssignmentFilterSchema = z.object({
    course: z.number().optional(),
    is_released: z.boolean().optional(),
    is_visible: z.boolean().optional(),
    name: z.string().optional(),
    ordering: z
        .enum(["created", "-created", "name", "-name", "sortKey", "-sortKey"])
        .optional(),
    page: z.number().int().min(1).optional(),
    page_size: z.number().int().min(1).max(100).optional(),
});

export const CourseFilterSchema = z.object({
    organization: z.number().optional(),
    period: z.string().optional(),
    archived: z.boolean().optional(),
    name: z.string().optional(),
    ordering: z
        .enum(["created", "-created", "name", "-name", "period", "-period"])
        .optional(),
    page: z.number().int().min(1).optional(),
    page_size: z.number().int().min(1).max(100).optional(),
});

// Export all types
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type CourseCreateRequest = z.infer<typeof CourseCreateRequestSchema>;
export type CourseUpdateRequest = z.infer<typeof CourseUpdateRequestSchema>;
export type AssignmentCreateRequest = z.infer<
    typeof AssignmentCreateRequestSchema
>;
export type AssignmentUpdateRequest = z.infer<
    typeof AssignmentUpdateRequestSchema
>;
export type SubmissionCreateRequest = z.infer<
    typeof SubmissionCreateRequestSchema
>;
export type SubmissionUpdateRequest = z.infer<
    typeof SubmissionUpdateRequestSchema
>;
export type CommentCreateRequest = z.infer<typeof CommentCreateRequestSchema>;
export type CommentUpdateRequest = z.infer<typeof CommentUpdateRequestSchema>;
export type FileCreateRequest = z.infer<typeof FileCreateRequestSchema>;
export type FileUpdateRequest = z.infer<typeof FileUpdateRequestSchema>;
export type TestCaseCreateRequest = z.infer<typeof TestCaseCreateRequestSchema>;
export type TestCaseUpdateRequest = z.infer<typeof TestCaseUpdateRequestSchema>;
export type EnvironmentCreateRequest = z.infer<
    typeof EnvironmentCreateRequestSchema
>;
export type EnvironmentUpdateRequest = z.infer<
    typeof EnvironmentUpdateRequestSchema
>;
export type SubmissionFilter = z.infer<typeof SubmissionFilterSchema>;
export type AssignmentFilter = z.infer<typeof AssignmentFilterSchema>;
export type CourseFilter = z.infer<typeof CourseFilterSchema>;
export type ApiResponse<T> = z.infer<ReturnType<typeof ApiResponseSchema<T>>>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type PaginatedResponse<T> = z.infer<
    ReturnType<typeof PaginatedResponseSchema<T>>
>;
