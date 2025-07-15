import fetch from "cross-fetch";
import { getUrl } from "./urls";

export class CodePostAPI {
    static MIN_REFRESH_DELAY = 60 * 1000;

    constructor(private baseUrl: string = "https://api.codepost.io") {
        // Set the base URL for the API
        if (!baseUrl) {
            throw new Error("Base URL must be provided");
        }
        if (!baseUrl.startsWith("http")) {
            throw new Error("Base URL must start with http or https");
        }
        if (!baseUrl.endsWith("/")) {
            baseUrl += "/";
        }
        this.baseUrl = baseUrl;
    }
    createError(message: string, response?: Response) {
        const meta = import.meta as any;
        if (
            Object.keys(meta).includes("env") &&
            meta["env"] &&
            meta["env"].VITE_DEBUG == "true"
        ) {
            console.error(message, response);
        }
        if (response) {
            return new Error(
                `CodePostAPI Error: ${message} - ${response.status} ${response.statusText}`,
            );
        }
        return new Error(`CodePostAPI Error: ${message}`);
    }
    async post<T>(
        endpoint: string,
        body: any,
        options: { token?: string; errorMessage?: string } = {},
    ) {
        const { token, errorMessage = "Failed to post data" } = options;
        if (!endpoint)
            throw this.createError(
                "Endpoint must be provided for POST request",
            );
        if (!body)
            throw this.createError("Body must be provided for POST request");

        const url = getUrl(`${this.baseUrl}/${endpoint}`);
        if (!url)
            throw this.createError(
                `Invalid URL for POST request ${this.baseUrl}/${endpoint}`,
            );
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });
        if (!res.ok) this.createError(`${errorMessage} ${url.toString()}`, res);
        return res.json() as Promise<T>;
    }
    async get<T>(
        endpoint: string,
        options: { token?: string; errorMessage?: string } = {},
    ) {
        const { token = null, errorMessage = "Failed to fetch data" } = options;
        const url = getUrl(`${this.baseUrl}/${endpoint}`);
        if (!url)
            throw this.createError(
                `Invalid URL for GET request ${this.baseUrl}/${endpoint}`,
            );
        // Init headers
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Make the GET request
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok)
            throw this.createError(`${errorMessage} ${url.toString()}`, res);
        return res.json() as Promise<T>;
    }
    async patch<T>(
        endpoint: string,
        body: unknown,
        options: { token?: string; errorMessage?: string } = {},
    ) {
        const { token = null, errorMessage = "Failed to patch data" } = options;
        const url = getUrl(`${this.baseUrl}/${endpoint}`);
        if (!url)
            throw this.createError(
                `Invalid URL for PATCH request ${this.baseUrl}/${endpoint}`,
            );
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(url, {
            method: "PATCH",
            headers,
            body: JSON.stringify(body),
        });
        if (!res.ok) this.createError(`${errorMessage} ${url.toString()}`, res);
        return res.json() as Promise<T>;
    }
    async delete(
        endpoint: string,
        options: { token?: string; errorMessage?: string } = {},
    ) {
        const { token = null, errorMessage = "Failed to delete data" } =
            options;
        const url = getUrl(`${this.baseUrl}/${endpoint}`);
        if (!url)
            throw this.createError(
                `Invalid URL for DELETE request ${this.baseUrl}/${endpoint}`,
            );
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(url, {
            method: "DELETE",
            headers,
        });
        if (!res.ok) this.createError(`${errorMessage} ${url.toString()}`, res);
        return res.json() as Promise<void>;
    }
}
