import { BasicFunctions, getQueryParams, QueryListParams } from "../api";
import { CommentSerializer } from "../comments";
import { CodePostHTTP } from "../http";
import {
    AnonymousSubmission,
    StudentSubmission,
    StudentSubmissionWithoutGrade,
    Submission,
    SubmissionHistory,
    SubmissionStatus,
    SubmissionWithoutFiles,
    SubmissionWithTests,
} from "../submissions";
import { AssignmentSchema } from "./schema";
import {
    Assignment,
    AssignmentQueueLength,
    AssignmentSubmissionedFilesResponse,
    AssignmentSubmissionHistoryQuery,
    AssignmentSubmissionInfoResponse,
    AssignmentSubmissionInfoResponseExtended,
    AssignmentSubmissionsQuery,
    AssignmentTestsResponse,
    RubricResponse,
} from "./types";

export const Assignments = {
    ...BasicFunctions<Assignment>("/assignments", AssignmentSchema),
    getAssignment: async (assignmentId: number) => {
        return await CodePostHTTP.get<Assignment>(`/assignments/${assignmentId}/`);
    },
    getComments: async (assignmentId: number) => {
        return await CodePostHTTP.get<CommentSerializer>(`/assignments/${assignmentId}/comments/`);
    },
    getQueueLength: async (assignmentId: number) => {
        return await CodePostHTTP.get<AssignmentQueueLength>(`/assignments/${assignmentId}/queueLength/`);
    },
    getRubric: async (assignmentId: number) => {
        return await CodePostHTTP.get<RubricResponse>(`/assignments/${assignmentId}/rubric/`);
    },
    getNextUnassigned: async (assignmentId: number, section?: string) => {
        const params = getQueryParams({ section });
        return await CodePostHTTP.get<Submission | AnonymousSubmission>(`/assignments/${assignmentId}/drawUnassigned/`, params);
    },
    listSubmissions: async (assignmentId: number, query?: AssignmentSubmissionsQuery) => {
        const params = getQueryParams(query);
        return await CodePostHTTP.get<
            | Submission[]
            | SubmissionWithoutFiles[]
            | AnonymousSubmission[]
            | StudentSubmission[]
            | StudentSubmissionWithoutGrade[]
            | SubmissionStatus[]
        >(`/assignments/${assignmentId}/submissions/`, params);
    },
    getSubmissionHistories: async (assignmentId: number, query?: AssignmentSubmissionHistoryQuery) => {
        const params = getQueryParams(query);
        return await CodePostHTTP.get<SubmissionHistory[]>(`/assignments/${assignmentId}/submissionHistories/`);
    },
    getTests: async (assignmentId: number) => {
        return await CodePostHTTP.get<AssignmentTestsResponse>(`/assignments/${assignmentId}/studentTests/`);
    },
    getAssignmentInfo: async (assignmentId: number) => {
        return await CodePostHTTP.get<AssignmentSubmissionInfoResponse | AssignmentSubmissionInfoResponseExtended>(
            `/assignments/${assignmentId}/beforeStudentUpload/`
        );
    },
    getSubmissionFiles: async (assignmentId: number) => {
        return await CodePostHTTP.get<AssignmentSubmissionedFilesResponse>(`/assignments/${assignmentId}/studentUpload/`);
    },
    Submit: async (assignmentId: number, files: File[], sendConfirmationEmail: boolean = false) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        if (sendConfirmationEmail) {
            formData.append("sendConfirmationEmail", sendConfirmationEmail.toString());
        }

        return await CodePostHTTP.post<SubmissionStatus>(`/assignments/${assignmentId}/studentUpload/`, formData);
    },
    addFileToSubmission: async (assignmentId: number, files: File[], sendConfirmationEmail: boolean = false) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        if (sendConfirmationEmail) {
            formData.append("sendConfirmationEmail", sendConfirmationEmail.toString());
        }

        return await CodePostHTTP.patch<SubmissionStatus>(`/assignments/${assignmentId}/studentUpload/`, formData);
    },
    getSubmissionTests: async (assignmentId: number, options?: QueryListParams) => {
        const params = getQueryParams(options);
        // This might be AssignmentSubmissionTestsResponse
        return await CodePostHTTP.get<SubmissionWithTests>(`/assignments/${assignmentId}/submissionTests/`, params);
    },
    clone: async (assignmentId: number, courseId: number) => {
        return await CodePostHTTP.post<"Success!">(`/assignments/${assignmentId}/clone/`, { course: courseId });
    },
};
