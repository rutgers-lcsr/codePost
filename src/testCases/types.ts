import { z } from "zod";
import {
    RunResponseSchema,
    TestCaseSchema,
    TestCaseStudentSchema,
} from "./schema";

export type TestCase = z.infer<typeof TestCaseSchema>;
export type TestCaseStudent = z.infer<typeof TestCaseStudentSchema>;
export type RunResponse = z.infer<typeof RunResponseSchema>;
