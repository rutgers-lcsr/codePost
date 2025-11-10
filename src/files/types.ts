import { z } from "zod";
import {
    AssignmentFileModelSchema,
    CourseFileModelSchema,
    FileModelSchema,
    FileSchema,
    FileStudentUploadSchema,
    FileValidationWithoutSubmissionSchema,
    SubmissionFileModelSchema,
} from "./schema";

// New types for specific file types
export type SubmissionFile = z.infer<typeof SubmissionFileModelSchema>;
export type AssignmentFile = z.infer<typeof AssignmentFileModelSchema>;
export type CourseFile = z.infer<typeof CourseFileModelSchema>;

// Legacy types (map to SubmissionFile for backwards compatibility)
export type File = z.infer<typeof FileSchema>;
export type FileModel = z.infer<typeof FileModelSchema>;
export type FileStudentUpload = z.infer<typeof FileStudentUploadSchema>;

export type FileValidationWithoutSubmission = z.infer<typeof FileValidationWithoutSubmissionSchema>;

// Helper type for file content (supports both 'data' and 'code')
export type FileContent = { data?: string; code?: string };
