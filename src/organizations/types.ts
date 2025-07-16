import z from "zod";
import { OrganizationSchema, QueryOrganizationListSchema } from "./schema";

export type Organization = z.infer<typeof OrganizationSchema>;
export type QueryOrganizationList = z.infer<typeof QueryOrganizationListSchema>;
