import { z } from "zod";
import { QueryResponseSchemaBase } from "../api/index";
export const CourseSchema = z.object({
    id: z.number(),
    name: z.string(),
    period: z.string(),
    assignments: z.array(z.number()),
    sections: z.array(z.number()),
    sendReleasedSubmissionsToBack: z.boolean(),
    showStudentsStatistics: z.boolean(),
    timezone: z.string(),
    emailNewUsers: z.boolean(),
    anonymousGradingDefault: z.boolean(),
    allowGradersToEditRubric: z.boolean(),
    minComments: z.number(),
    noUnfinalize: z.boolean(),
    archived: z.boolean(),
    lateDayCreditsAllowable: z.nullable(z.string()),
    activateQueue: z.boolean(),
    inviteCode: z.nullable(z.string()),
    emailWhitelist: z.string(),
    inviteCodeEnabled: z.boolean(),
    enableStudentFeedbackNotifications: z.boolean(),
    webhooks: z.array(z.number()),
});

export const CourseListResponseSchema = z.array(CourseSchema);

export const CourseSettingsSchema = z.object({
    id: z.number(),
    sendReleasedSubmissionsToBack: z.boolean(),
    showStudentsStatistics: z.boolean(),
    timezone: z.string(),
    emailNewUsers: z.boolean(),
    anonymousGradingDefault: z.boolean(),
    allowGradersToEditRubric: z.boolean(),
    archived: z.boolean(),
    lateDayCreditsAllowable: z.nullable(z.string()),
});

export const CourseSettingsUpdateSchema = z.object({
    sendReleasedSubmissionsToBack: z.boolean().optional(),
    showStudentsStatistics: z.boolean().optional(),
    timezone: z.string().optional(),
    emailNewUsers: z.boolean().optional(),
    anonymousGradingDefault: z.boolean().optional(),
    allowGradersToEditRubric: z.boolean().optional(),
    archived: z.boolean().optional(),
    lateDayCreditsAllowable: z.nullable(z.string()).optional(),
});

export const CourseRosterSchema = z.object({
    id: z.number(),
    organization: z.number(),
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
export const CourseRosterUpdateSchema = z.object({
    students: z.array(z.string()).optional(),
    graders: z.array(z.string()).optional(),
    superGraders: z.array(z.string()).optional(),
    courseAdmins: z.array(z.string()).optional(),
});

export const CourseLMSRosterSchema = z.record(z.string(), z.email());
export const CourseStudentCaptionsSchema = z.record(z.email(), z.string());

export const CourseSectionSchema = z.object({
    id: z.number(),
    name: z.string(),
    students: z.array(z.string()),
    leaders: z.array(z.string()),
});
export const CourseSectionsListSchema = QueryResponseSchemaBase.extend({
    results: z.array(CourseSectionSchema),
});
