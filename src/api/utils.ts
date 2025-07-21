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
export function BasicFunctions<ObjectModel, Paged extends boolean = false>(endpoint: string, ObjectModelSchema: z.ZodObject<any>, pagedList?: Paged) {
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
        list: list as Paged extends true ? (options?: QueryListParams) => PagedListReturn : () => UnpagedListReturn,
        create: async (data: Omit<ObjectModel, "id">) => {
            const validated = ObjectModelSchema.omit({ id: true }).parse(data);
            return await CodePostHTTP.post<ObjectModel>(endpoint, validated);
        },
        retrieve: async (objectId: number) => {
            return await CodePostHTTP.get<ObjectModel>(`${endpoint}/${objectId}/`);
        },
        update: async (objectId: number, data: ObjectModel) => {
            const validated = ObjectModelSchema.parse(data);
            return await CodePostHTTP.update<ObjectModel>(`${endpoint}/${objectId}/`, validated);
        },
        delete: async (objectId: number) => {
            return await CodePostHTTP.delete<ObjectModel>(`${endpoint}/${objectId}/`);
        },
        partial_update: async (objectId: number, data: Partial<ObjectModel>) => {
            const validated = ObjectModelSchema.partial().parse(data);
            return await CodePostHTTP.patch<ObjectModel>(`${endpoint}/${objectId}/`, validated);
        },
    };
}

export class CodePostApiError extends Error {
    constructor(message: string, public response?: Response) {
        super(message);
        this.name = "CodePostApiError";
    }
    static isCodePostApiError(error: unknown): error is CodePostApiError {
        return error instanceof CodePostApiError;
    }
    getData<T>() {
        if (!this.response) {
            return null;
        }
        const contentType = this.response.headers.get("Content-Type");
        if (contentType?.includes("application/json")) {
            return this.response.json() as Promise<T>;
        } else if (contentType?.includes("text/plain")) {
            return this.response.text() as Promise<T>;
        }
        return null;
    }
    isForbidden() {
        return this.response?.status === 403;
    }
    isUnauthorized() {
        return this.response?.status === 401;
    }
    isNotFound() {
        return this.response?.status === 404;
    }
    isBadRequest() {
        return this.response?.status === 400;
    }
    isServerError() {
        if (!this.response) {
            return false;
        }
        return this.response?.status >= 500 && this.response?.status < 600;
    }
}
