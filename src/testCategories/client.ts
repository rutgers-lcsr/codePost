import { CodePostHTTP } from "../http";
import { BasicFunctions } from "../api/utils";
import { TestCategory } from "./types";
import { TestCategorySchema } from "./schema";

export const TestCategories = {
    ...BasicFunctions<TestCategory>("/testCategories", TestCategorySchema),
};
