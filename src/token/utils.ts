import { SlidingToken, Token } from "./types";

export const isSlidingToken = (token: Token): token is SlidingToken => {
    return "token" in token && typeof token.token === "string";
}
export const isPairToken = (token: Token): token is Token => {
    return "access" in token && "refresh" in token;
}