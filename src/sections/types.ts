import { z } from "zod";
import { SectionSchema } from "./schema";

export type Section = z.infer<typeof SectionSchema>;
