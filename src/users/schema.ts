import { z } from "zod";
import { CourseListResponseSchema } from "../courses";
import { SectionSchema } from "../sections";
import { QueryListParamsSchema } from "../api";
export const UserSchema = z.object({
    id: z.number(),
    email: z.string(),
    organization: z.string(),
    studentCourses: CourseListResponseSchema,
    graderCourses: CourseListResponseSchema,
    superGraderCourses: CourseListResponseSchema,
    courseadminCourses: CourseListResponseSchema,
    leaderSections: z.array(SectionSchema),
    codePostAdmin: z.boolean(),
    canCreateCourses: z.boolean(),
    canModifyRosters: z.boolean(),
    showProductTips: z.boolean(),
    api_token: z.string().nullable(),
    student_sections: z.array(z.number()),
    hasCredentials: z.boolean(),
    token: z.string().optional(),
});
export const UserListSchema = QueryListParamsSchema.extend({
    results: z.array(UserSchema),
});

export const UserUpdateSchema = z.object({
    showProductTips: z.boolean(),
});

export const EmailRequestSchema = z.object({
    course: z.number(),
    assignment: z.number().optional(),
    template: z.string(),
    livemode: z.boolean().optional(),
});
export const EmailSuccessSchema = z.object({
    suceess: z.boolean(),
});
