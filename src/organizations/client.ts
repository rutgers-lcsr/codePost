import { BasicFunctions, getQueryParams } from "../api/utils";
import { QueryListParams } from "../api/types";
import { CodePostHTTP } from "../http";
import { OrganizationSchema } from "./schema";
import { Organization, QueryOrganizationList } from "./types";

const basicOrganizationFunctions = BasicFunctions<Organization, true>("/organizations", OrganizationSchema, true);

export const Organizations = {
    ...basicOrganizationFunctions,
};
