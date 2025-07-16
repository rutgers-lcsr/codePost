import z from "zod";
import { SubmissionTestSchema } from "./schema";

export type SubmissionTest = z.infer<typeof SubmissionTestSchema>;
