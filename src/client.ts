import { Token } from "./types";
import { CodePostAPI } from "./utils/api";

export class CodePostClient {
    api: CodePostAPI;
    token: string | null = null;
    constructor(options: { baseUrl?: string } = {}) {
        const { baseUrl } = options;
        this.api = new CodePostAPI(baseUrl);
    }
    private setToken(token: string) {
        if (window) {
            // update this to have codepost_token instead of just token
            return window.localStorage.setItem("token", token);
        }
        this.token = token;
    }
    /**
     * Retrieves the token from localStorage or the class property.
     * Errors if the token is not set.
     */
    private getToken() {
        // Check if running in a browser environment, if so, retrieve token from localStorage
        if (window) {
            const token = window.localStorage.getItem("token");
            if (!token) {
                throw this.api.createError("Token not set. Please login first.");
            }
            return token;
        }
        if (!this.token) {
            throw this.api.createError("Token not set. Please login first.");
        }
        return this.token;
    }
    async login(username: string, password: string) {
        const response = await this.api.post<Token.TokenResponse>("token-auth/", { username, password });
        this.setToken(response.token);
        return response.user;
    }
    private async refreshToken() {
        const response = await this.api.post<Token.TokenRefreshResponse>("token-refresh/", {}, { token: this.getToken() });
        this.setToken(response.token);
        return response.token;
    }
    async verifyToken() {
        const token = this.getToken();
        try {
            await this.api.get("token-verify", { token });
            return true;
        } catch (error) {
            if (error instanceof Error && error.message.includes("401")) {
                // Token is invalid, refresh it
                await this.refreshToken();
                return true;
            }
            throw error; // Re-throw other errors
        }
    }
    async getUser() {}
    async getAssignments(courseId: string) {
        return null;
    }
}
