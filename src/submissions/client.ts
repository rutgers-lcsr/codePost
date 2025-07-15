import { getQueryParams, QueryListParams } from "../api";
import { CodePostHTTP } from "../http";
import { SubmissionHistory } from "../types";
import {
    PartnerLinkResponse,
    RegradeRequest,
    StudentSubmission,
    SubmissionHistoryQuery,
    SubmissionList,
    SubmissionPermissions,
    SubmissionTest,
    TestResultsResponse,
    UpdateSubmissionHistory,
} from "./types";

export const Submissions = {
    list: async (options?: QueryListParams) => {
        const params = getQueryParams(options);
        return await CodePostHTTP.get<SubmissionList>(`/submissions/`, params);
    },
    getPermissions: async (submissionId: string) => {
        return await CodePostHTTP.get<SubmissionPermissions>(
            `/submissions/${submissionId}/checkPermission/`,
        );
    },
    getHistory: async (
        submissionId: string,
        options?: SubmissionHistoryQuery,
    ) => {
        const params = getQueryParams(options);
        return await CodePostHTTP.get<SubmissionHistory[]>(
            `/submissions/${submissionId}/history/`,
            params,
        );
    },
    updateHistory: async (
        submissionId: string,
        options?: UpdateSubmissionHistory,
    ) => {
        return await CodePostHTTP.patch<SubmissionHistory>(
            `/submissions/${submissionId}/history/`,
            options,
        );
    },
    submitRegrade: async (submissionId: string, options: RegradeRequest) => {
        return await CodePostHTTP.patch<
            StudentSubmission | Omit<StudentSubmission, "grade">
        >(`/submissions/${submissionId}/submitRegrade/`, options);
    },
    deleteRegrade: async (submissionId: string) => {
        return await CodePostHTTP.patch<
            StudentSubmission | Omit<StudentSubmission, "grade">
        >(`/submissions/${submissionId}/deleteRegrade/`, {});
    },
    submissionTests: async (submissionId: string) => {
        // DEPRECATED
        return "NOT IMPLEMENTED";
    },
    getTestResults: async (submissionId: string) => {
        return await CodePostHTTP.get<TestResultsResponse>(
            `/submissions/${submissionId}/testResults/`,
        );
    },
    generatePartnerLink: async (submissionId: string) => {
        return await CodePostHTTP.get<PartnerLinkResponse>(
            `/submissions/${submissionId}/partnerLink/`,
        );
    },
    validatePartnerLink: async (submissionId: string, token: string) => {
        const params = getQueryParams({ token });

        return await CodePostHTTP.get<string>(
            `/submissions/${submissionId}/validatePartnerLink/`,
            params,
        );
    },
    getPartnerLink: async (submissionId: string, token: string) => {
        const params = getQueryParams({ token });

        return await CodePostHTTP.get<StudentSubmission>(
            `/submissions/${submissionId}/queryPartnerLink/`,
            params,
        );
    },
    removePartnerLink: async (submissionId: string) => {
        return await CodePostHTTP.get<"ok">(
            `/submissions/${submissionId}/removePartnerLink/`,
        );
    },
    notifyStudents: async (submissionId: string) => {
        return await CodePostHTTP.post<"Notifications sent!">(
            `/submissions/${submissionId}/notifyStudents/`,
            {},
        );
    },
};
