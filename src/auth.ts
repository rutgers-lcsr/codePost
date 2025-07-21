import { createError } from "./errors";

import { Tokens } from "./token";
import { isPairToken, isSlidingToken } from "./token/utils";


let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshTimeout: NodeJS.Timeout | number | null = null;
let tokenType = "sliding"

import { isBrowser } from "./utils/browser";


async function loginSlidingToken(username: string, password: string) {
    const loginResponse = await Tokens.login(username, password);
    const user = loginResponse.user;
    if (!isSlidingToken(loginResponse)) {
        throw createError(`Invalid sliding token response: ${JSON.stringify(loginResponse)} ${username} ${password}`);
    }
    setSlidingToken(loginResponse.token);
    return user
}
function setSlidingToken(newAccessToken: string) {
    const payload = JSON.parse(atob(newAccessToken.split(".")[1]));
    const expirationTime = payload.exp * 1000;

    // set the delay to a min before expiration
    const delay = expirationTime - Date.now();
    if (delay <= 0) {
        throw createError(`trying to set expired token`);
    }
    // set timeout to ask api for another token
    refreshTimeout = setTimeout(refreshSlidingAuthToken, delay + 1000);
    if (isBrowser) {
        window.localStorage.setItem("accessToken", newAccessToken);
        return;
    }
    accessToken = newAccessToken;
}
async function refreshSlidingAuthToken() {
    let accessToken = getAccessToken();
    if (!accessToken) {
        throw createError(`trying to refresh token without refresh token`);
    }
    const { token } = await Tokens.refreshSliding(accessToken);
    setSlidingToken(token);
    return token;
}


async function loginPair(username: string, password: string) {
    const loginResponse = await Tokens.login(username, password);
    const user = loginResponse.user;
    if (!isPairToken(loginResponse)) {
        throw createError(`Invalid token pair response: ${JSON.stringify(loginResponse)}`);
    }
    const { access, refresh } = loginResponse;
    setTokenPair(access, refresh);
    return user;
}



/*
Initalized the authication process if its running in a browser enviroment. Will check if the users is already authenticated
*/
function initializeAuth() {
    if (!isBrowser) return;
    accessToken = window.localStorage.getItem("accessToken");
    refreshToken = window.localStorage.getItem("refreshToken");

    if (!accessToken) {
        return;
    }

    if (tokenType == "sliding") {
        setSlidingToken(accessToken);
    } else if (tokenType == "pair") {
        if (!refreshToken) {
            throw createError(`No refresh token found in local storage`);
        }
        setTokenPair(accessToken, refreshToken);
    }
}
// Clearing the tokens allows for a user to log out
function clearTokens() {
    if (isBrowser) {
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
    }
    accessToken = null;
    refreshToken = null;
}

function setTokenPair(access: string, refresh: string) {
    if (refreshTimeout) clearTimeout(refreshTimeout);
    const payload = JSON.parse(atob(access.split(".")[1]));
    const expirationTime = payload.exp * 1000;

    // set the delay to a min before expiration
    const delay = expirationTime - Date.now();
    if (delay <= 0) {
        throw createError(`trying to set expired token`);
    }
    // set timeout to ask api for another token
    refreshTimeout = setTimeout(refreshAuthTokenPair, delay + 1000);
    if (isBrowser) {
        window.localStorage.setItem("accessToken", access);
        window.localStorage.setItem("refreshToken", refresh);
        return;
    }
    accessToken = access;
    refreshToken = refresh;
    return;

}


async function refreshAuthTokenPair() {
    let refreshToken = getRefreshToken();
    if (!refreshToken) {
        throw createError(`trying to refresh token without refresh token`);
    }
    const { access, refresh } = await Tokens.refresh(refreshToken);
    setTokenPair(access, refresh || refreshToken);
    return access;
}
async function verifyToken(token: string) {
    try {
        await Tokens.verify(token);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function getRefreshToken() {
    if (isBrowser) {
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
function getAccessToken() {
    if (isBrowser) {
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


export const Auth = {
    login: async (username: string, password: string) => {
        switch (tokenType) {
            case "sliding":
                return await loginSlidingToken(username, password);
            case "pair":
                return await loginPair(username, password);
            default:
                throw createError(`Invalid token type: ${tokenType}`);
        }
    },
    setToken: (newAccessToken: string, newRefreshToken?: string) => {
        switch (tokenType) {
            case "sliding":
                setSlidingToken(newAccessToken);
                break;
            case "pair":
                if (!newRefreshToken) {
                    throw createError("Refresh token must be provided for pair token type");
                }
                setTokenPair(newAccessToken, newRefreshToken);
                break;
            default:
                throw createError(`Invalid token type: ${tokenType}`);
        }
    },
    getAccessToken,
    clearTokens,
    verifyToken,

}

