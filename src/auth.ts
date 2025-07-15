import { createError } from "./errors";
import {
    AccessTokenUpdateRequest,
    AccessTokenUpdateResponse,
    AccessTokenUpdateResponseSchema,
    Token,
} from "./token";
import { Tokens } from "./token";
// TO-DO :
// Move token request to token client

let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshTimeout: number | null = null;

export async function login(username: string, password: string) {
    const { access, refresh } = await Tokens.login(username, password);

    setToken(access, refresh);
}

/*
Initalized the authication process if its running in a browser enviroment. Will check if the users is already authenticated
*/
function initializeAuth() {
    if (window) {
        accessToken = window.localStorage.getItem("accessToken");
        refreshToken = window.localStorage.getItem("refreshToken");
        if (accessToken && refreshToken) {
            setToken(accessToken, refreshToken);
            refreshAuthToken();
        }
    }
}
// Clearing the tokens allows for a user to log out
export function clearTokens() {
    if (window) {
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
    }
    accessToken = null;
    refreshToken = null;
}

export function setToken(newAccessToken: string, newRefreshToken: string) {
    if (refreshTimeout) clearTimeout(refreshTimeout);
    const payload = JSON.parse(atob(newAccessToken.split(".")[1]));
    const expirationTime = payload.exp * 1000;

    // set the delay to a min before expiration
    const delay = expirationTime - Date.now();
    if (delay <= 0) {
        throw createError(`trying to set expired token`);
    }
    // set timeout to ask api for another token
    refreshTimeout = setTimeout(refreshAuthToken, delay + 1000);
    if (window) {
        window.localStorage.setItem("accessToken", newAccessToken);
        window.localStorage.setItem("refreshToken", newRefreshToken);
        return;
    }
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
}
export async function refreshAuthToken() {
    let refreshToken = getRefreshToken();
    if (!refreshToken) {
        throw createError(`trying to refresh token without refresh token`);
    }
    const { access, refresh } = await Tokens.refresh(refreshToken);
    setToken(access, refresh || refreshToken);
    return access;
}
export async function verifyToken(token: string) {
    try {
        await Tokens.verify(token);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export function getRefreshToken() {
    if (window) {
        const token = window.localStorage.getItem("refreshToken");
        if (!token) {
            return null;
        }
        return token;
    }
    if (!refreshToken) {
        return null;
    }
    return refreshToken;
}
export function getAccessToken() {
    if (window) {
        const token = window.localStorage.getItem("accessToken");
        if (!token) {
            return null;
        }
        return token;
    }
    if (!accessToken) {
        return null;
    }
    return accessToken;
}

// Call initializeAuth to start the authentication process
initializeAuth();
