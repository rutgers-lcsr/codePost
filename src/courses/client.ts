import { getQueryParams, QueryListParams } from "../api";
import { CodePostHTTP } from "../http";
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

export const Courses = {
    list: async () => await CodePostHTTP.get<CourseListResponse[]>("/courses/"),
    getCourse: async (courseId: string) =>
        await CodePostHTTP.get<Course>(`/courses/${courseId}/`, {}),
    getCourseSettings: async (courseId: string) =>
        await CodePostHTTP.get<CourseSettings>(
            `/courses/${courseId}/courseSettings/`,
        ),
    updateCourseSettings: async (
        courseId: string,
        settings: CourseSettingsUpdate,
    ) => {
        const updatedSettings = { ...settings, id: courseId };
        return await CodePostHTTP.patch<CourseSettings>(
            `/courses/${courseId}/courseSettings/`,
            updatedSettings,
        );
    },
    changeInviteCode: async (courseId: string) =>
        await CodePostHTTP.patch<string>(
            `/courses/${courseId}/changeInviteCode/`,
            {},
        ),
    getRoster: async (courseId: string) =>
        await CodePostHTTP.get<CourseRoster>(
            `/courses/${courseId}/roster/`,
            {},
        ),
    updateRoster: async (
        courseId: string,
        roster: Omit<CourseRosterUpdate, "superGraders">,
    ) => {
        const updatedRoster = { ...roster, id: courseId };
        return await CodePostHTTP.patch<CourseRoster>(
            `/courses/${courseId}/roster/`,
            updatedRoster,
        );
    },
    addToRoster: async (courseId: string, roster: CourseRosterUpdate) => {
        const updatedRoster = { ...roster, id: courseId };
        return await CodePostHTTP.post<CourseRoster>(
            `/courses/${courseId}/roster/`,
            updatedRoster,
        );
    },
    removeFromRoster: async (courseId: string, roster: CourseRosterUpdate) => {
        const updatedRoster = { ...roster, id: courseId };
        return await CodePostHTTP.patch<CourseRoster>(
            `/courses/${courseId}/roster/`,
            updatedRoster,
        );
    },
    deleteRubricCategory: async (courseId: string, categoryId: string) => {
        return "NOT IMPLEMENTED";
        return await CodePostHTTP.patch<string>(
            `/courses/${courseId}/rubric/${categoryId}/`,
            {},
        );
    },
    getLMSRoster: async (courseId: string) => {
        return await CodePostHTTP.get<CourseLMSRoster>(
            `/courses/${courseId}/rosterMap/`,
            {},
        );
    },
    updateLMSRoster: async (courseId: string, roster: CourseLMSRoster) => {
        return await CodePostHTTP.patch<CourseRoster>(
            `/courses/${courseId}/rosterMap/`,
            roster,
        );
    },
    getStudentCaptions: async (courseId: string) => {
        return await CodePostHTTP.get<CourseStudentCaptions>(
            `/courses/${courseId}/studentCaptions/`,
            {},
        );
    },
    updateStudentCaptions: async (
        courseId: string,
        captions: CourseStudentCaptions,
    ) => {
        return await CodePostHTTP.patch<CourseStudentCaptions>(
            `/courses/${courseId}/studentCaptions/`,
            captions,
        );
    },
    getSections: async (courseId: string, options: QueryListParams) => {
        const params = getQueryParams(options);
        return await CodePostHTTP.get<CourseSectionList>(
            `/courses/${courseId}/sections/`,
            params,
        );
    },
};
