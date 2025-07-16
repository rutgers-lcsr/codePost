import { z } from "zod";
import {
    FileModelSchema,
    FileSchema,
    FileStudentUploadSchema,
    FileValidationWithoutSubmissionSchema,
} from "./schema";

export type File = z.infer<typeof FileSchema>;
export type FileModel = z.infer<typeof FileModelSchema>;
export type FileStudentUpload = z.infer<typeof FileStudentUploadSchema>;

export type FileValidationWithoutSubmission = z.infer<
    typeof FileValidationWithoutSubmissionSchema
>;
