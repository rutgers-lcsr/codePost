import { BasicFunctions, getQueryParams } from "../api/utils";
import { QueryListParams } from "../api/types";

import { CodePostHTTP } from "../http";
import { CourseSchema } from "./schema";
import {
    Course,
    CourseListResponse,
    CourseLMSRoster,
    CourseRoster,
    CourseRosterUpdate,
    CourseSectionList,
    CourseSettings,
    CourseSettingsUpdate,
    CourseStudentCaptions,
} from "./types";
const basicCourseFunctions = BasicFunctions<Course>("/courses", CourseSchema);

export const Courses = {
    ...basicCourseFunctions,
    getCourse: async (courseId: number) => await CodePostHTTP.get<Course>(`/courses/${courseId}/`, {}),
    getCourseSettings: async (courseId: number) => await CodePostHTTP.get<CourseSettings>(`/courses/${courseId}/courseSettings/`),
    updateCourseSettings: async (courseId: number, settings: CourseSettingsUpdate) => {
        const updatedSettings = { ...settings, id: courseId };
        return await CodePostHTTP.patch<CourseSettings>(`/courses/${courseId}/courseSettings/`, updatedSettings);
    },
    changeInviteCode: async (courseId: number) => await CodePostHTTP.patch<string>(`/courses/${courseId}/changeInviteCode/`, {}),
    getRoster: async (courseId: number) => await CodePostHTTP.get<CourseRoster>(`/courses/${courseId}/roster/`, {}),
    updateRoster: async (courseId: number, roster: Omit<CourseRosterUpdate, "superGraders">) => {
        const updatedRoster = { ...roster, id: courseId };
        return await CodePostHTTP.patch<CourseRoster>(`/courses/${courseId}/roster/`, updatedRoster);
    },
    addToRoster: async (courseId: number, roster: CourseRosterUpdate) => {
        const updatedRoster = { ...roster, id: courseId };
        return await CodePostHTTP.post<CourseRoster>(`/courses/${courseId}/roster/`, updatedRoster);
    },
    removeFromRoster: async (courseId: number, roster: CourseRosterUpdate) => {
        const updatedRoster = { ...roster, id: courseId };
        return await CodePostHTTP.patch<CourseRoster>(`/courses/${courseId}/roster/`, updatedRoster);
    },
    deleteRubricCategory: async (courseId: number, categoryId: string) => {
        return "NOT IMPLEMENTED";
        return await CodePostHTTP.patch<string>(`/courses/${courseId}/rubric/${categoryId}/`, {});
    },
    getLMSRoster: async (courseId: number) => {
        return await CodePostHTTP.get<CourseLMSRoster>(`/courses/${courseId}/rosterMap/`, {});
    },
    updateLMSRoster: async (courseId: number, roster: CourseLMSRoster) => {
        return await CodePostHTTP.patch<CourseRoster>(`/courses/${courseId}/rosterMap/`, roster);
    },
    getStudentCaptions: async (courseId: number) => {
        return await CodePostHTTP.get<CourseStudentCaptions>(`/courses/${courseId}/studentCaptions/`, {});
    },
    updateStudentCaptions: async (courseId: number, captions: CourseStudentCaptions) => {
        return await CodePostHTTP.patch<CourseStudentCaptions>(`/courses/${courseId}/studentCaptions/`, captions);
    },
    getSections: async (courseId: number, options?: QueryListParams) => {
        const params = getQueryParams(options);
        return await CodePostHTTP.get<CourseSectionList>(`/courses/${courseId}/sections/`, params);
    },
};
