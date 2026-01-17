import { BasicFunctions, getQueryParams } from "../api/utils";
import { QueryListParams } from "../api/types";
import { CodePostHTTP } from "../http";
import { SubmissionSchema } from "./schema";
import {
    PartnerLinkResponse,
    RegradeRequest,
    StudentSubmission,
    Submission,
    SubmissionHistory,
    SubmissionHistoryQuery,
    SubmissionPermissions,
    TestResultsResponse,
    UpdateSubmissionHistory,
} from "./types";

export const Submissions = {
    ...BasicFunctions<Submission>("/submissions", SubmissionSchema),
    getPermissions: async (submissionId: number) => {
        return await CodePostHTTP.get<SubmissionPermissions>(`/submissions/${submissionId}/checkPermission/`);
    },
    getHistory: async (submissionId: number, options?: SubmissionHistoryQuery) => {
        const params = getQueryParams(options);
        return await CodePostHTTP.get<SubmissionHistory[]>(`/submissions/${submissionId}/history/`, params);
    },
    updateHistory: async (submissionId: number, options?: UpdateSubmissionHistory) => {
        return await CodePostHTTP.patch<SubmissionHistory>(`/submissions/${submissionId}/history/`, options);
    },
    submitRegrade: async (submissionId: number, options: RegradeRequest) => {
        return await CodePostHTTP.patch<StudentSubmission | Omit<StudentSubmission, "grade">>(`/submissions/${submissionId}/submitRegrade/`, options);
    },
    deleteRegrade: async (submissionId: number) => {
        return await CodePostHTTP.patch<StudentSubmission | Omit<StudentSubmission, "grade">>(`/submissions/${submissionId}/deleteRegrade/`, {});
    },
    submissionTests: async (submissionId: number) => {
        // DEPRECATED
        return "NOT IMPLEMENTED";
    },
    getTestResults: async (submissionId: number) => {
        return await CodePostHTTP.get<TestResultsResponse>(`/submissions/${submissionId}/testResults/`);
    },
    generatePartnerLink: async (submissionId: number) => {
        return await CodePostHTTP.get<PartnerLinkResponse>(`/submissions/${submissionId}/partnerLink/`);
    },
    validatePartnerLink: async (submissionId: number, token: string) => {
        const params = getQueryParams({ token });

        return await CodePostHTTP.get<string>(`/submissions/${submissionId}/validatePartnerLink/`, params);
    },
    getPartnerLink: async (submissionId: number, token: string) => {
        const params = getQueryParams({ token });

        return await CodePostHTTP.get<StudentSubmission>(`/submissions/${submissionId}/queryPartnerLink/`, params);
    },
    removePartnerLink: async (submissionId: number) => {
        return await CodePostHTTP.get<"ok">(`/submissions/${submissionId}/removePartnerLink/`);
    },
    notifyStudents: async (submissionId: number) => {
        return await CodePostHTTP.post<"Notifications sent!">(`/submissions/${submissionId}/notifyStudents/`, {});
    },
};
