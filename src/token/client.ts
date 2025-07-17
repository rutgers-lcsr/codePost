import { CodePostHTTP } from "../http";
import {
    AccessTokenUpdateRequest,
    AccessTokenUpdateResponse,
    SlidingToken,
    Token,
    UserLogin,
} from "./types";

export const Tokens = {
    refresh: async (refreshToken: string) => {
        const response = await CodePostHTTP.post<
            AccessTokenUpdateResponse,
            AccessTokenUpdateRequest
        >("/token-refresh/", { refresh: refreshToken });
        return response;
    },
    refreshSliding: async (slidingToken: string) => {
        return await CodePostHTTP.post<SlidingToken>(
            "/token-refresh/",
            { token: slidingToken },
        );
    },
    verify: async (accessToken: string) => {
        const response = await CodePostHTTP.post<AccessTokenUpdateResponse>(
            "/token-verify/",
            { access: accessToken },
        );
        return response;
    },
    login: async (username: string, password: string) => {
        const response = await CodePostHTTP.post<Token>("/token-auth/", {
            username,
            password,
        });
        return response;
    },
};
