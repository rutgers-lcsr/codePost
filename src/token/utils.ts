import { CodePostError, createError } from "../errors";
import { SlidingToken, Token, TokenPair } from "./types";

export const isSlidingToken = (token: Token): token is SlidingToken => {
    return "token" in token && typeof token.token === "string";
};
export const isPairToken = (token: Token): token is TokenPair => {
    return "access" in token && "refresh" in token;
};

export function getTokenExpiration(token: string): number {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.exp) {
            throw createError("Token does not have exp field");
        }
        return payload.exp * 1000;
    } catch (error) {
        if (error instanceof CodePostError) {
            throw error;
        }
        throw createError("Invalid token format");
    }
}
export const isTokenExpired = (token: string) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now());
    return payload.exp < currentTime;
};
