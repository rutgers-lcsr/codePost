import { QueryListParamsSchema, QueryResponseSchemaBase } from "./schema";
import z from "zod";

export type QueryListParams = z.infer<typeof QueryListParamsSchema>;
export type QueryResponseBase = z.infer<typeof QueryResponseSchemaBase>;
