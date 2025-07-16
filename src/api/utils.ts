import z from "zod";
import { CodePostHTTP } from "../http";
import { QueryListParams, QueryResponseBase } from "./types";
import {
    Assignment,
    AssignmentBaseSchema,
    AssignmentSchema,
} from "../assignments";
export function getQueryParams(params = {}): Record<string, string> {
    const results = new Map<string, string>();
    for (const [key, value] of Object.entries<any>(params)) {
        results.set(key, value.toString());
    }
    return Object.fromEntries(results);
}

export function BasicFunctions<ObjectModel>(
    endpoint: string,
    ObjectModelSchema: z.ZodObject,
) {
    return {
        list: async (options?: QueryListParams) => {
            const params = getQueryParams(options);
            const response = await CodePostHTTP.get<
                QueryResponseBase & { results: ObjectModel[] }
            >(endpoint, params);
            return response;
        },
        create: async (data: Omit<ObjectModel, "id">) => {
            const validatedData = ObjectModelSchema.omit({ id: true }).parse(
                data,
            );
            const response = await CodePostHTTP.post<ObjectModel>(
                endpoint,
                validatedData,
            );
            return response;
        },
        retrieve: async (id: string) => {
            const response = await CodePostHTTP.get<ObjectModel>(
                `${endpoint}/${id}`,
            );
            return response;
        },
        update: async (id: string, data: ObjectModel) => {
            const validatedData = ObjectModelSchema.parse(data);
            const response = await CodePostHTTP.update<ObjectModel>(
                `${endpoint}/${id}`,
                validatedData,
            );
            return response;
        },
        delete: async (id: string) => {
            const response = await CodePostHTTP.delete<ObjectModel>(
                `${endpoint}/${id}`,
            );
            return response;
        },
        partial_update: async (id: string, data: Partial<ObjectModel>) => {
            const validatedData = ObjectModelSchema.partial().parse(data);
            const response = await CodePostHTTP.patch<ObjectModel>(
                `${endpoint}/${id}`,
                validatedData,
            );
            return response;
        },
    };
}
