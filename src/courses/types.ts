import {
    CourseListResponseSchema,
    CourseLMSRosterSchema,
    CourseRosterSchema,
    CourseRosterUpdateSchema,
    CourseSchema,
    CourseSectionSchema,
    CourseSectionsListSchema,
    CourseSettingsSchema,
    CourseSettingsUpdateSchema,
    CourseStudentCaptionsSchema,
} from "./schema";
import z from "zod";

export type CourseListResponse = z.infer<typeof CourseListResponseSchema>[];
export type Course = z.infer<typeof CourseSchema>;
export type CourseSettings = z.infer<typeof CourseSettingsSchema>;
export type CourseSettingsUpdate = z.infer<typeof CourseSettingsUpdateSchema>;
export type CourseRoster = z.infer<typeof CourseRosterSchema>;
export type CourseRosterUpdate = z.infer<typeof CourseRosterUpdateSchema>;
export type CourseLMSRoster = z.infer<typeof CourseLMSRosterSchema>;
export type CourseStudentCaptions = z.infer<typeof CourseStudentCaptionsSchema>;
export type CourseSection = z.infer<typeof CourseSectionSchema>;
export type CourseSectionList = z.infer<typeof CourseSectionsListSchema>;
