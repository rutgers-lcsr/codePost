import z from "zod";
import { CodePostHTTP } from "../http";
import { QueryListParams, QueryResponseBase } from "./types";

export function getQueryParams(params = {}): Record<string, string> {
    const results = new Map<string, string>();
    for (const [key, value] of Object.entries<any>(params)) {
        results.set(key, value.toString());
    }
    return Object.fromEntries(results);
}
export function BasicFunctions<
    ObjectModel,
    Paged extends boolean = false
>(
    endpoint: string,
    ObjectModelSchema: z.ZodObject<any>,
    pagedList?: Paged
) {
    type PagedListReturn = Promise<QueryResponseBase & { results: ObjectModel[] }>;
    type UnpagedListReturn = Promise<ObjectModel[]>;

    const list = pagedList
        ? async (options?: QueryListParams): PagedListReturn => {
            const params = getQueryParams(options);
            return await CodePostHTTP.get<QueryResponseBase & { results: ObjectModel[] }>(endpoint, params);
        }
        : async (): UnpagedListReturn => {
            return await CodePostHTTP.get<ObjectModel[]>(endpoint);
        };

    return {
        list: list as Paged extends true
            ? (options?: QueryListParams) => PagedListReturn
            : () => UnpagedListReturn,
        create: async (data: Omit<ObjectModel, "id">) => {
            const validated = ObjectModelSchema.omit({ id: true }).parse(data);
            return await CodePostHTTP.post<ObjectModel>(endpoint, validated);
        },
        retrieve: async (id: string) => {
            return await CodePostHTTP.get<ObjectModel>(`${endpoint}/${id}`);
        },
        update: async (id: string, data: ObjectModel) => {
            const validated = ObjectModelSchema.parse(data);
            return await CodePostHTTP.update<ObjectModel>(`${endpoint}/${id}`, validated);
        },
        delete: async (id: string) => {
            return await CodePostHTTP.delete<ObjectModel>(`${endpoint}/${id}`);
        },
        partial_update: async (id: string, data: Partial<ObjectModel>) => {
            const validated = ObjectModelSchema.partial().parse(data);
            return await CodePostHTTP.patch<ObjectModel>(`${endpoint}/${id}`, validated);
        },
    };
}
