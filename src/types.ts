import z from "zod";

// Base schema for all models with timestamp fields
export const BaseModelSchema = z.object({
    id: z.number(),
    created: z.string().datetime(),
    modified: z.string().datetime(),
});

// Organization Schema
export const OrganizationSchema = BaseModelSchema.extend({
    name: z.string().max(64),
    shortname: z.string().max(12),
});

// Profile Schema
export const ProfileSchema = BaseModelSchema.extend({
    user: z.number(), // User ID reference
    api_token: z.number().nullable(), // Token ID reference
    organization: z.number().nullable(), // Organization ID reference
    canCreateCourses: z.boolean(),
    canModifyRosters: z.boolean(),
    pendingValidation: z.boolean(),
    showProductTips: z.boolean(),
    stripeCustomerId: z.string().max(96).nullable(),
});

// Course Schema
export const CourseSchema = BaseModelSchema.extend({
    name: z.string().max(36),
    organization: z.number(), // Organization ID reference
    period: z.string().max(32),
    archived: z.boolean(),
    students: z.array(z.number()), // Array of User IDs
    inactive_students: z.array(z.number()),
    inactive_graders: z.array(z.number()),
    inactive_courseAdmins: z.array(z.number()),
    graders: z.array(z.number()),
    superGraders: z.array(z.number()),
    courseAdmins: z.array(z.number()),
    // Settings
    sendReleasedSubmissionsToBack: z.boolean(),
    showStudentsStatistics: z.boolean(),
    timezone: z.string().max(32),
    emailNewUsers: z.boolean(),
    anonymousGradingDefault: z.boolean(),
    allowGradersToEditRubric: z.boolean(),
    minComments: z.number().int(),
    noUnfinalize: z.boolean(),
    lateDayCreditsAllowable: z.number().int().nullable(),
    rosterMap: z.record(z.string(), z.string()),
    studentCaptions: z.record(z.string(), z.string()),
    useStudentCaptions: z.boolean(),
    activateQueue: z.boolean(),
    inviteCode: z.string().max(10).nullable(),
    emailWhitelist: z.string(),
    inviteCodeEnabled: z.boolean(),
    enableStudentFeedbackNotifications: z.boolean(),
    manual_payments: z.array(
        z.object({
            id: z.string(),
            timestamp: z.string(),
            amount: z.number(),
            description: z.string(),
            email: z.string(),
        }),
    ),
    waiver_requested: z.boolean(),
});

// Section Schema
export const SectionSchema = BaseModelSchema.extend({
    name: z.string().max(16),
    course: z.number(), // Course ID reference
    leaders: z.array(z.number()), // Array of User IDs
    students: z.array(z.number()), // Array of User IDs
});

// Assignment Schema
export const AssignmentSchema = BaseModelSchema.extend({
    isVisible: z.boolean(),
    explanation: z.string(),
    hideFrom: z.array(z.number()), // Array of Section IDs
    course: z.number(), // Course ID reference
    name: z.string().max(32),
    isReleased: z.boolean(),
    points: z.number().min(0),
    mean: z.number().min(0).nullable(),
    median: z.number().min(0).nullable(),
    sortKey: z.number().int(),
    // Settings
    hideGrades: z.boolean(),
    anonymousGrading: z.boolean(),
    commentFeedback: z.boolean(),
    allowStudentUpload: z.boolean(),
    allowStudentUploadWithPartners: z.boolean(),
    uploadDueDate: z.string().datetime().nullable(),
    liveFeedbackMode: z.boolean(),
    additiveGrading: z.boolean(),
    hideGradersFromStudents: z.boolean(),
    collaborativeRubricMode: z.boolean(),
    allowRegradeRequests: z.boolean(),
    regradeInstructions: z.string(),
    regradeDeadline: z.string().datetime().nullable(),
    forcedRubricMode: z.boolean(),
    templateMode: z.boolean(),
    showFrequentlyUsedRubricComments: z.boolean(),
    allowLateUploads: z.boolean(),
    lateDeductions: z.array(z.number()),
});

// RubricCategory Schema
export const RubricCategorySchema = BaseModelSchema.extend({
    assignment: z.number(), // Assignment ID reference
    name: z.string().max(72),
    pointLimit: z.number().int().nullable(),
    sortKey: z.number().int(),
    helpText: z.string(),
    atMostOnce: z.boolean(),
});

// RubricComment Schema
export const RubricCommentSchema = BaseModelSchema.extend({
    text: z.string(),
    explanation: z.string(),
    instructionText: z.string(),
    templateTextOn: z.boolean(),
    pointDelta: z.number(),
    category: z.number(), // RubricCategory ID reference
    sortKey: z.number().int(),
    name: z.string().max(255).nullable(),
});

// Submission Schema
export const SubmissionSchema = BaseModelSchema.extend({
    assignment: z.number(), // Assignment ID reference
    students: z.array(z.number()), // Array of User IDs
    grader: z.number().nullable(), // User ID reference
    isFinalized: z.boolean(),
    dateEdited: z.string().datetime(),
    grade: z.number().min(0).nullable(),
    queueOrderKey: z.number().int(),
    gradeFrozen: z.boolean(),
    dateUploaded: z.string().datetime(),
    lateDayCreditsUsed: z.number().int(),
    // Student question fields
    questionIsOpen: z.boolean(),
    questionIsRegrade: z.boolean(),
    questionResponder: z.number().nullable(), // User ID reference
    questionText: z.string().max(500),
    questionResponse: z.string(),
    questionDate: z.string().datetime().nullable(),
    responseDate: z.string().datetime().nullable(),
    testRunsCompleted: z.number().int().min(0),
});

// FileTemplate Schema
export const FileTemplateSchema = BaseModelSchema.extend({
    name: z.string().max(150),
    code: z.string(),
    extension: z.string().max(36),
    path: z.string().max(500).nullable(),
    assignment: z.number(), // Assignment ID reference
    required: z.boolean(),
    description: z.string(),
});

// File Schema
export const FileSchema = BaseModelSchema.extend({
    name: z.string().max(150),
    code: z.string(),
    submission: z.number(), // Submission ID reference
    extension: z.string().max(36),
    path: z.string().max(500).nullable(),
    hiddenBeforePublish: z.boolean(),
});

// CommentTag Schema
export const CommentTagSchema = BaseModelSchema.extend({
    label: z.string().max(64),
});

// Comment Schema
export const CommentSchema = BaseModelSchema.extend({
    text: z.string(),
    pointDelta: z.number().nullable(),
    rubricComment: z.number().nullable(), // RubricComment ID reference
    author: z.number(), // User ID reference
    file: z.number(), // File ID reference
    startChar: z.number().int(),
    endChar: z.number().int(),
    startLine: z.number().int(),
    endLine: z.number().int(),
    feedback: z.number().int(),
    color: z
        .string()
        .max(7)
        .regex(/^#[0-9A-Fa-f]{6}$/)
        .nullable(),
    tags: z.array(z.number()), // Array of CommentTag IDs
});

// TestCategory Schema
export const TestCategorySchema = BaseModelSchema.extend({
    assignment: z.number(), // Assignment ID reference
    name: z.string().max(48),
});

// TestCase Schema
export const TestCaseSchema = BaseModelSchema.extend({
    testCategory: z.number(), // TestCategory ID reference
    sortKey: z.number().int(),
    description: z.string().max(48),
    type: z.enum(["io", "io_cli", "unit", "shell", "file", "external"]),
    pointsFail: z.number(),
    pointsPass: z.number(),
    text: z.string(),
    explanation: z.string(),
    exposed: z.boolean(),
    lastSolutionRun: z.union([
        z.literal(0),
        z.literal(1),
        z.literal(2),
        z.literal(3),
    ]), // 0: Passed, 1: Failed, 2: Error, 3: Never run
    // I/O Test specific fields
    function: z.string(),
    fileName: z.string(),
    outputIsFile: z.boolean(),
    expectedOutput: z.string(),
    input: z.string(),
    checkReturn: z.boolean(),
    isFlexible: z.boolean(),
    outputIsRegexp: z.boolean(),
});

// SubmissionTest Schema
export const SubmissionTestSchema = BaseModelSchema.extend({
    submission: z.number(), // Submission ID reference
    testCase: z.number(), // TestCase ID reference
    logs: z.string(),
    passed: z.boolean(),
    isError: z.boolean(),
});

// SubmissionHistory Schema
export const SubmissionHistorySchema = BaseModelSchema.extend({
    submission: z.number(), // Submission ID reference
    student: z.number(), // User ID reference
    hasViewed: z.boolean(),
    dateViewed: z.string().datetime().nullable(),
});

// Environment Schema
export const EnvironmentSchema = BaseModelSchema.extend({
    assignment: z.number(), // Assignment ID reference (OneToOne)
    dockerRunInstructions: z.array(z.string()),
    language: z.enum([
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
    ]),
    buildType: z.enum(["default", "alpine", "ubuntu", "windows"]),
    dockerfile: z.string(),
    compileText: z.string(),
    isRunning: z.boolean(),
    dumpMode: z.boolean(),
    testParsing: z.boolean(),
    allowNetworkAccess: z.boolean(),
    maxStudentTestRuns: z.number().int().min(0).nullable(),
    exposeDumpLogs: z.boolean(),
    maxExposedFailedTests: z.number().int().min(0).nullable(),
    buildID: z.number().int().min(0),
});

// SolutionFile Schema
export const SolutionFileSchema = BaseModelSchema.extend({
    name: z.string().max(48),
    code: z.string(),
    path: z.string().max(500).nullable(),
    environment: z.number(), // Environment ID reference
});

// HelperFile Schema
export const HelperFileSchema = BaseModelSchema.extend({
    name: z.string().max(48),
    code: z.string(),
    path: z.string().max(500).nullable(),
    environment: z.number(), // Environment ID reference
});

// SourceFile Schema
export const SourceFileSchema = BaseModelSchema.extend({
    code: z.string(),
    name: z.string().max(48),
    environment: z.number(), // Environment ID reference
});

// User Schema (Django User model)
export const UserSchema = z.object({
    id: z.number(),
    username: z.string(),
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
    is_active: z.boolean(),
    is_staff: z.boolean(),
    is_superuser: z.boolean(),
    date_joined: z.string().datetime(),
    last_login: z.string().datetime().nullable(),
});

// Webhook Schema
export const WebhookSchema = z.object({
    id: z.number(),
    url: z.string().url(),
    events: z.array(z.string()),
});

// Extended schemas with relations
export const AssignmentWithStatisticsSchema = AssignmentSchema.extend({
    submissions_count: z.number().optional(),
    submissions_finalized_count: z.number().optional(),
    submissions_inprogress_count: z.number().optional(),
    submissions_unclaimed_count: z.number().optional(),
    submissions_missing_count: z.number().optional(),
    stats_max: z.number().optional(),
    stats_min: z.number().optional(),
    stats_mean: z.number().optional(),
});

export const CourseWithRosterSchema = CourseSchema.extend({
    students_details: z.array(UserSchema).optional(),
    graders_details: z.array(UserSchema).optional(),
    courseAdmins_details: z.array(UserSchema).optional(),
});

export const CourseSettingsSchema = z.object({
    id: z.number(),
    sendReleasedSubmissionsToBack: z.boolean(),
    showStudentsStatistics: z.boolean(),
    timezone: z.string(),
    emailNewUsers: z.boolean(),
    anonymousGradingDefault: z.boolean(),
    allowGradersToEditRubric: z.boolean(),
    archived: z.boolean(),
    lateDayCreditsAllowable: z.number(),
    activateQueue: z.boolean(),
});

export const CourseRosterSchema = z.object({
    id: z.number(),
    organization: z.string(),
    name: z.string(),
    period: z.string(),
    students: z.array(z.string()),
    graders: z.array(z.string()),
    superGraders: z.array(z.string()),
    courseAdmins: z.array(z.string()),
    inactive_students: z.array(z.string()),
    inactive_graders: z.array(z.string()),
    inactive_courseAdmins: z.array(z.string()),
    not_activated: z.array(z.string()),
});

// Type exports
export type Organization = z.infer<typeof OrganizationSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type CourseWithRoster = z.infer<typeof CourseWithRosterSchema>;
export type CourseSettings = z.infer<typeof CourseSettingsSchema>;
export type CourseRoster = z.infer<typeof CourseRosterSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Assignment = z.infer<typeof AssignmentSchema>;
export type AssignmentWithStatistics = z.infer<
    typeof AssignmentWithStatisticsSchema
>;
export type RubricCategory = z.infer<typeof RubricCategorySchema>;
export type RubricComment = z.infer<typeof RubricCommentSchema>;
export type Submission = z.infer<typeof SubmissionSchema>;
export type FileTemplate = z.infer<typeof FileTemplateSchema>;
export type File = z.infer<typeof FileSchema>;
export type CommentTag = z.infer<typeof CommentTagSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type TestCategory = z.infer<typeof TestCategorySchema>;
export type TestCase = z.infer<typeof TestCaseSchema>;
export type SubmissionTest = z.infer<typeof SubmissionTestSchema>;
export type SubmissionHistory = z.infer<typeof SubmissionHistorySchema>;
export type Environment = z.infer<typeof EnvironmentSchema>;
export type SolutionFile = z.infer<typeof SolutionFileSchema>;
export type HelperFile = z.infer<typeof HelperFileSchema>;
export type SourceFile = z.infer<typeof SourceFileSchema>;
export type User = z.infer<typeof UserSchema>;
export type Webhook = z.infer<typeof WebhookSchema>;

// API Response types
export namespace Users {
    const baseEndpoint = "users";
    export namespace REST {
        export const endpoint = () => `${baseEndpoint}/`;
        export namespace GET {
            export const ResponseSchema = z.array(UserSchema);
        }
    }
    export namespace Email {
        export namespace REST {
            export const endpoint = (email: string) =>
                `${baseEndpoint}/${email}/email`;
            export namespace POST {
                export const RequestSchema = z.object({
                    course: z.number(),
                    assignment: z.number().optional(),
                    template: z.string().optional(),
                    livemode: z.boolean().optional(),
                });
                export const ResponseSchema = z.object({
                    success: z.boolean(),
                });
                export type Request = z.infer<typeof RequestSchema>;
                export type Response = z.infer<typeof ResponseSchema>;
            }
        }
    }
    export namespace Me {
        export namespace REST {
            export const endpoint = () => `${baseEndpoint}/me/`;
            export namespace GET {
                export const ResponseSchema = UserSchema;
                export type Response = User;
            }
            export namespace PATCH {
                export const RequestSchema = z.object({
                    showProductTips: z.boolean(),
                });
                export const ResponseSchema = z.object({
                    success: z.boolean(),
                });
                export type Request = z.infer<typeof RequestSchema>;
                export type Response = User;
            }
        }
    }
    export namespace requestAPIToken {
        export namespace REST {
            export const endpoint = () => `${baseEndpoint}/requestAPIToken/`;
            export namespace POST {
                export const ResponseSchema = UserSchema;
                export type Response = User;
            }
        }
    }
}

export namespace Courses {
    const baseEndpoint = "courses";
    export namespace list {
        export namespace REST {
            export namespace GET {
                export const endpoint = `${baseEndpoint}/`;
                export const ResponseSchema = z.array(CourseSchema);
                export type Response = Course[];
            }
        }
    }
    export namespace REST {
        export namespace GET {
            export const endpoint = (id: string) => `${baseEndpoint}/${id}/`;
            export const ResponseSchema = CourseSchema;
            export type Response = Course;
        }
    }
    export namespace courseSettings {
        export namespace REST {
            export const endpoint = (id: string) =>
                `${baseEndpoint}/${id}/courseSettings/`;
            export namespace GET {
                export type params = {
                    courseId: number;
                };
                export const ResponseSchema = CourseSettingsSchema;
                export type Response = CourseSettings;
            }
            export namespace PATCH {
                export type params = {
                    courseId: number;
                };
                const bodyRequest = CourseSettingsSchema.partial();
                export type body = z.infer<typeof bodyRequest>;
                export const ResponseSchema = CourseSettingsSchema;
                export type Response = CourseSettings;
            }
        }
    }
    export namespace changeInviteCode {
        export const endpoint = (id: string) =>
            `${baseEndpoint}/${id}/changeInviteCode/`;
        export namespace REST {
            export namespace PATCH {
                export type params = {
                    courseId: number;
                };
                export type Response = string;
            }
        }
    }
    export namespace roster {
        export const endpoint = (id: string) => `${baseEndpoint}/${id}/roster/`;
        export namespace REST {
            export namespace GET {
                export type params = {
                    courseId: number;
                };
                export type Response = CourseRoster;
            }
            export namespace PATCH {
                export type params = {
                    courseId: number;
                };
                const bodyRequest = CourseRosterSchema.partial();
                export type body = z.infer<typeof bodyRequest>;
                export const ResponseSchema = CourseRosterSchema;
                export type Response = CourseRoster;
            }
        }
    }
    export namespace addToRoster {
        export namespace REST {
            export const endpoint = (id: string) =>
                `${baseEndpoint}/${id}/roster`;
            export namespace PATCH {
                export type params = {
                    courseId: number;
                };
                const bodyRequest = CourseRosterSchema.partial();
                export type body = z.infer<typeof bodyRequest>;
                export const ResponseSchema = CourseRosterSchema;
                export type Response = CourseRoster;
            }
        }
    }
    export namespace removeFromRoster {
        export namespace REST {
            export const endpoint = (id: string) =>
                `${baseEndpoint}/${id}/removeFromRoster`;
            export namespace PATCH {
                export type params = {
                    courseId: number;
                };
                const bodyRequest = CourseRosterSchema.partial();
                export type body = z.infer<typeof bodyRequest>;
                export const ResponseSchema = CourseRosterSchema;
                export type Response = CourseRoster;
            }
        }
    }
    export namespace deleteRubricCategory {
        export namespace REST {
            export const endpoint = (id: string) =>
                `${baseEndpoint}/${id}/deleteRubricCategory`;
            export namespace PATCH {
                export type params = {
                    courseId: number;
                };
                const formRequest = z.object({
                    id: z.number(),
                });
                export type form = z.infer<typeof formRequest>;
                export type Response = 200 | 400;
            }
        }
    }
    export namespace rosterMap {
        export namespace REST {
            export const endpoint = (id: string) =>
                `${baseEndpoint}/${id}/rosterMap`;
            export namespace GET {
                export const endpoint = (id: string) =>
                    `${baseEndpoint}/${id}/rosterMap`;
                export type Response = z.infer<
                    typeof CourseSchema.shape.rosterMap
                >;
            }
        }
    }
}

export namespace Token {
    export interface TokenResponse {
        token: string;
        user: User;
    }
    export interface TokenRefreshResponse {
        token: string;
    }
}

// Utility schemas for common operations
export const CreateAssignmentSchema = AssignmentSchema.omit({
    id: true,
    created: true,
    modified: true,
    mean: true,
    median: true,
});

export const UpdateAssignmentSchema = AssignmentSchema.partial().omit({
    id: true,
    created: true,
    modified: true,
});

export const CreateSubmissionSchema = SubmissionSchema.omit({
    id: true,
    created: true,
    modified: true,
    dateEdited: true,
    dateUploaded: true,
    grade: true,
});

export const UpdateSubmissionSchema = SubmissionSchema.partial().omit({
    id: true,
    created: true,
    modified: true,
    dateUploaded: true,
});

export type CreateAssignment = z.infer<typeof CreateAssignmentSchema>;
export type UpdateAssignment = z.infer<typeof UpdateAssignmentSchema>;
export type CreateSubmission = z.infer<typeof CreateSubmissionSchema>;
export type UpdateSubmission = z.infer<typeof UpdateSubmissionSchema>;
