import fetch from "cross-fetch";
import z from "zod";
import { CodePostApiError } from "./api";
import { Auth } from "./auth";
import { createError } from "./errors";
import { isBrowser } from "./utils/browser";
import { getUrl } from "./utils/urls";
let baseUrl = "https://codepost-api.cs.rutgers.edu/";

export function setBaseUrl(newBaseUrl: string) {
    if (!newBaseUrl) {
        throw createError("Base URL must be provided");
    }
    if (!newBaseUrl.startsWith("http")) {
        throw createError("Base URL must start with http or https");
    }
    if (!newBaseUrl.endsWith("/")) {
        newBaseUrl += "/";
    }
    baseUrl = newBaseUrl;
}
function getHTTPHeaders() {
    const authToken = Auth.getAccessToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        "User-Agent": "Codepost SDK v1.0",
        Accept: "application/json",
    };
    if (isBrowser) {
        headers["Cookie"] = document.cookie;
        headers["Origin"] = window.location.origin;
        headers["User-Agent"] = navigator.userAgent;
        headers["Accept"] = "application/json";
        headers["X-Requested-With"] = "XMLHttpRequest";
    }
    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }
    return headers;
}

// add error handling for HTTP requests
export const CodePostHTTP = {
    async post<T, D = unknown>(requestedPath: string, data: D, schema?: z.ZodSchema<T>): Promise<T> {
        const url = getUrl(baseUrl, requestedPath);
        if (!url) {
            throw createError("Invalid URL");
        }
        const headers = getHTTPHeaders();

        let body;
        if (data instanceof FormData) {
            body = data;
            headers["Content-Type"] = "multipart/form-data";
        } else {
            body = JSON.stringify(data);
        }

        const response = await fetch(url, {
            method: "POST",
            headers,
            body,
        });
        if (!response.ok) {
            throw new CodePostApiError(`POST request failed`, response);
        }
        const json = await response.json();
        return schema?.parse(json) ?? json;
    },
    async get<T>(requestedPath: string, requestParams: Record<string, string> = {}, schema?: z.ZodSchema<T>): Promise<T> {
        const url = getUrl(baseUrl, requestedPath);
        if (!url) {
            throw createError("Invalid URL");
        }
        const headers = getHTTPHeaders();
        const params = new URLSearchParams(requestParams);

        const endpointUrl = params.toString() === "" ? url : `${url}?${params.toString()}`;

        const response = await fetch(endpointUrl, {
            method: "GET",
            headers,
        });
        if (!response.ok) {
            throw new CodePostApiError(`GET request failed`, response);
        }
        const json = await response.json();
        return schema?.parse(json) ?? json;
    },
    async patch<T, D = unknown>(requestedPath: string, data: D, schema?: z.ZodSchema<T>): Promise<T> {
        const url = getUrl(baseUrl, requestedPath);
        if (!url) {
            throw createError("Invalid URL");
        }
        const headers = getHTTPHeaders();

        const response = await fetch(url, {
            method: "PATCH",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new CodePostApiError(`PATCH request failed`, response);
        }
        const json = await response.json();
        return schema?.parse(json) ?? json;
    },
    async delete<T>(requestedPath: string, schema?: z.ZodSchema<T>): Promise<T> {
        const url = getUrl(baseUrl, requestedPath);
        if (!url) {
            throw createError("Invalid URL");
        }
        const headers = getHTTPHeaders();

        const response = await fetch(url, {
            method: "DELETE",
            headers,
        });
        if (!response.ok) {
            throw new CodePostApiError(`DELETE request failed`, response);
        }
        const json = await response.json();
        return schema?.parse(json) ?? json;
    },
    async update<T, D = unknown>(requestedPath: string, data: D, schema?: z.ZodSchema<T>): Promise<T> {
        const url = getUrl(baseUrl, requestedPath);
        if (!url) {
            throw createError("Invalid URL");
        }
        const headers = getHTTPHeaders();

        const response = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new CodePostApiError(`DELETE request failed`, response);
        }
        const json = await response.json();
        return schema?.parse(json) ?? json;
    },
};
