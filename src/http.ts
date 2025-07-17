import fetch from "cross-fetch";
import { getUrl } from "./utils/urls";
import { createError } from "./errors";
import { getAccessToken } from "./auth";
import z from "zod";
let baseUrl = "https://api.codepost.io/";
import { isBrowser } from "./utils/browser";

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
    const authToken = getAccessToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        "User-Agent": "Codepost SDK v1.0",
        Accept: "application/json",
    };
    if (isBrowser) {
        headers["Cookie"] = document.cookie;
        headers["Referer"] = window.location.href;
        headers["Origin"] = window.location.origin;
        headers["User-Agent"] = navigator.userAgent;
        headers["Accept"] = "application/json";
        headers["X-Requested-With"] = "XMLHttpRequest";
        headers["X-Forwarded-For"] = window.location.host;
    }
    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }
    return headers;
}

async function CodepostAPINonOkResponseErrorHandler(response: Response) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
        return response.json()
    }
    if (contentType && contentType.includes("text/plain")) {
        return await response.text();
    }
    if (isBrowser) {
        if (contentType && contentType.includes("application/json")) {
            return response.json()
        }
        if (contentType && contentType.includes("text/plain")) {
            return await response.text();
        }
    }

    return response.text().then((text) => {
        const error = new Error(`Codepost API request failed with status ${response.status}: ${text}`);
        (error as any).response = response;
        throw error;
    });
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
            return CodepostAPINonOkResponseErrorHandler(response);

            const error = await response.text();
            throw createError(`GET request failed ${error}`, response);
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
            return CodepostAPINonOkResponseErrorHandler(response);

            const error = await response.text();
            throw createError(`GET request failed ${error}`, response);
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
            const error = await response.text();
            throw createError(`PATCH request failed ${error}`, response);
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
            return CodepostAPINonOkResponseErrorHandler(response);

            const error = await response.text();
            throw createError(`DELETE request failed ${error}`, response);
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
            return CodepostAPINonOkResponseErrorHandler(response);

            const error = await response.text();
            throw createError(`PUT request failed ${error}`, response);
        }
        const json = await response.json();
        return schema?.parse(json) ?? json;
    },
};
