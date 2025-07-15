import { Token, Users } from "./types";
import { CodePostAPI } from "./utils/api";

export class CodePostClient {
    api: CodePostAPI;
    token: string | null = null;
    apiToken: string | null = null;
    refreshTimeout: number | null = null;
    User: User;
    constructor(options: { baseUrl?: string; apiToken?: string } = {}) {
        const { baseUrl, apiToken = null } = options;
        this.api = new CodePostAPI(baseUrl);
        if (apiToken) this.setToken(apiToken);
        this.User = new User(this);
    }
    private setToken(token: string) {
        // extract the expiration time from the token payload
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = payload.exp * 1000;

        // set the delay to a min before expiration
        const delay = expirationTime - Date.now();
        if (delay <= 0) {
            throw this.api.createError(`trying to set expired token`);
        }

        this.refreshTimeout = setTimeout(
            this.refreshToken,
            delay + CodePostAPI.MIN_REFRESH_DELAY,
        );

        // set the token
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
    getToken() {
        // Check if running in a browser environment, if so, retrieve token from localStorage
        if (window) {
            const token = window.localStorage.getItem("token");
            if (!token) {
                throw this.api.createError(
                    "Token not set. Please login first.",
                );
            }
            return token;
        }
        if (!this.token) {
            throw this.api.createError("Token not set. Please login first.");
        }
        return this.token;
    }
    async login(username: string, password: string) {
        const response = await this.api.post<Token.TokenResponse>(
            "token-auth/",
            { username, password },
        );
        this.setToken(response.token);
        return response.user;
    }
    private async refreshToken() {
        const response = await this.api.post<Token.TokenRefreshResponse>(
            "token-refresh/",
            {},
            { token: this.getToken() },
        );
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
}

class User {
    constructor(private client: CodePostClient) {}

    async email(email: string, options: Users.Email.REST.POST.Request) {
        const { course, assignment, template, livemode } = options || {};
        const response =
            await this.client.api.post<Users.Email.REST.POST.Response>(
                `email/${email}.json`,
                { email, course, assignment, template, livemode },
                { token: this.client.getToken() },
            );
        return response;
    }

    async getMe() {
        const response = await this.client.api.get<Users.Me.REST.GET.Response>(
            "me",
            {
                token: this.client.getToken(),
            },
        );
        return response;
    }
    async patchMe(options: Users.Me.REST.PATCH.Request) {
        const { showProductTips } = options;
        const response = await this.client.api.patch<User>(
            "me",
            { showProductTips },
            { token: this.client.getToken() },
        );
        return response;
    }
}
