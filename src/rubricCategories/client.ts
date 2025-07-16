import { CodePostHTTP } from "../http";
import { BasicFunctions } from "../api";
import { RubricCategory } from "./types";
import { RubricCategorySchema } from "./schema";

export const RubricCategories = {
    ...BasicFunctions<RubricCategory>(
        "/rubricCategories",
        RubricCategorySchema,
    ),
};
