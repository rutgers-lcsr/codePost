import { BasicFunctions, getQueryParams } from "../api";
import { CodePostHTTP } from "../http";
import { AnonymousSubmission, Submission } from "../submissions";
import { SectionSchema } from "./schema";
import { Section } from "./types";

export const Sections = {
    ...BasicFunctions<Section>("/sections", SectionSchema),
    async getSubmissions(sectionId: string, assignmentId: string) {
        const params = getQueryParams({ assignment: assignmentId });
        return await CodePostHTTP.get<AnonymousSubmission[] | Submission[]>(
            `/sections/${sectionId}/submissions/`,
            params,
        );
    },
};
