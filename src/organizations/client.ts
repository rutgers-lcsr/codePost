import { BasicFunctions, getQueryParams, QueryListParams } from "../api";
import { CodePostHTTP } from "../http";
import { OrganizationSchema } from "./schema";
import { Organization, QueryOrganizationList } from "./types";

const basicOrganizationFunctions = BasicFunctions<Organization>(
    "/organizations",
    OrganizationSchema,
);

export const Organizations = {
    ...basicOrganizationFunctions,
};
