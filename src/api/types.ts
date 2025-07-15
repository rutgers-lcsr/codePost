import { QueryListParamsSchema } from "./schema";
import z from "zod";

export type QueryListParams = z.infer<typeof QueryListParamsSchema>;
