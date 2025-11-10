import { BasicFunctions } from "../api";
import { AssignmentFileModelSchema, CourseFileModelSchema, FileSchema, SubmissionFileModelSchema } from "./schema";
import { AssignmentFile, CourseFile, File, SubmissionFile } from "./types";

export const Files = {
    ...BasicFunctions<File>("/files", FileSchema),
};

export const SubmissionFiles = {
    ...BasicFunctions<SubmissionFile>("/submissionFiles", SubmissionFileModelSchema),
};

export const AssignmentFiles = {
    ...BasicFunctions<AssignmentFile>("/assignmentFiles", AssignmentFileModelSchema),
};

export const CourseFiles = {
    ...BasicFunctions<CourseFile>("/courseFiles", CourseFileModelSchema),
};
