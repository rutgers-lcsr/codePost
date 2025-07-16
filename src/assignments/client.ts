import { getQueryParams, QueryListParams } from "../api";
import { CodePostHTTP } from "../http";
import { Assignment, AssignmentQueueLength, CommentSerializer, QueryAssignmentList } from "./types";

export const Assignments = {
    list: async (options: QueryListParams) => {
        const params = getQueryParams(options);
        return await CodePostHTTP.get<QueryAssignmentList>("/assignments/", params);
    },
    getAssignment: async (assignmentId: number) => {
        return await CodePostHTTP.get<Assignment>(`/assignments/${assignmentId}/`);
    },
    getComments: async (assignmentId: number) => {
        return await CodePostHTTP.get<CommentSerializer>(`/assignments/${assignmentId}/comments/`);
    },
    getQueueLength: async (assignmentId: number) => {
        return await CodePostHTTP.get<AssignmentQueueLength>(`/assignments/${assignmentId}/queueLength/`);
    },
    getRubric: async (assignmentId: number) => {},
};
