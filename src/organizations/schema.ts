import { z } from "zod";
import { QueryResponseSchemaBase } from "../api";

export const OrganizationSchema = z.object({
    id: z.number(),
    name: z.string().min(1).max(64),
    shortname: z.string().min(1).max(12),
});

export const QueryOrganizationListSchema = QueryResponseSchemaBase.extend({
    results: z.array(OrganizationSchema),
});
