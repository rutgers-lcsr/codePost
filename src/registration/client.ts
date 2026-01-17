import { getQueryParams } from "../api/utils";
import { Auth } from "../auth";
import { CodePostHTTP } from "../http";
import { getTokenExpiration, isTokenExpired } from "../token/utils";
import { User, UserSchema } from "../users";
import { isBrowser } from "../utils/browser";
import {
    AdminCheckStatusResponse,
    EmailRegisterResponse,
    HandleValidationResponse,
    PasswordResetEmailResponse,
    PasswordResetResponse,
    RegisterAndSetPasswordResponse,
    SetCredentialsResponse,
    ValidateMoocSignupResponse,
    ValidateNewAdminUserResponse,
    VerifyRegistrationTokenResponse,
    VerifyResetTokenResponse,
} from "./types";

export const RegistrationClient = {
    CurrentUser: async () => {
        if (isBrowser) {
            // Check local storage for existing user as a cache to avoid unnecessary API calls
            const storedUser = window.localStorage.getItem("codepost-user");
            if (storedUser) {
                const parsedUser: User = JSON.parse(storedUser);
                const validatedUser = UserSchema.parse(parsedUser); // Validate the structure
                if (!validatedUser.token || isTokenExpired(validatedUser.token)) {
                    // If no token, clear the stored user
                    window.localStorage.removeItem("codepost-user");
                } else {
                    return validatedUser;
                }
            }
        }

        const currentUser = await CodePostHTTP.get<User>("/registration/current_user/");

        if (currentUser.token) {
            // Set the token for future authenticated requests
            const currentToken = Auth.getAccessToken();
            if (!currentToken || getTokenExpiration(currentToken) < getTokenExpiration(currentUser.token)) {
                // if no token is set or the current user's token is newer, update it
                // this allows for tokens that are set not to expire for a while to stay in use unless a newer one is provided
                Auth.setToken(currentUser.token);
            }
        }

        if (isBrowser) {
            window.localStorage.setItem("codepost-user", JSON.stringify(currentUser));
        }

        return currentUser;
    },
    // Join Flow
    EmailRegister: async (email: string, token: string) => {
        const emailForm = new FormData();
        emailForm.append("email", email);
        emailForm.append("token", token);

        return await CodePostHTTP.post<EmailRegisterResponse, FormData>("/registration/emailRegistration/", emailForm);
    },
    VerifyRegistrationToken: async (token: string, uid: string) => {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("uid", uid);

        return await CodePostHTTP.post<VerifyRegistrationTokenResponse, FormData>(`/registration/verifyRegistrationToken/`, formData);
    },
    RegisterAndSetPassword: async (token: string, uid: string, password1: string) => {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("uid", uid);
        formData.append("password1", password1);

        return await CodePostHTTP.post<RegisterAndSetPasswordResponse, FormData>(`/registration/registerAndSetPassword/`, formData);
    },
    // Create Flow
    ValidateNewAdminUser: async (email: string, organization: string) => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("organization", organization);
        await CodePostHTTP.post<ValidateNewAdminUserResponse, FormData>(`/registration/validateNewAdminUser/`, formData);
    },
    ValidateMoocSignup: async (email: string) => {
        const formData = new FormData();
        formData.append("email", email);

        await CodePostHTTP.post<ValidateMoocSignupResponse, FormData>(`/registration/validateMoocSignup/`, formData);
    },

    HandleValidationResponse: async (token: string, uid: string, activate: boolean) => {
        const params = getQueryParams({
            token: token,
            uid: uid,
            activate: activate,
        });

        await CodePostHTTP.get<HandleValidationResponse>(`/registration/handleValidationResponse/`, params);
    },
    AdminCheckStatus: async (email: string) => {
        return await CodePostHTTP.get<AdminCheckStatusResponse>("/registration/adminCheckStatus/");
    },
    // Password Reset Flow
    GetEmailForPasswordReset: async (email: string, is_mooc: boolean) => {
        const formData = new FormData();
        formData.append("email", email);

        if (is_mooc) {
            formData.append("is_mooc", "true");
        }

        return await CodePostHTTP.post<PasswordResetEmailResponse, FormData>("/registration/emailPasswordReset/", formData);
    },
    VerifyPasswordResetToken: async (token: string, uid: string) => {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("uid", uid);

        return await CodePostHTTP.post<VerifyResetTokenResponse, FormData>("/registration/verifyResetToken/", formData);
    },
    ResetPassword: async (token: string, uid: string, password1: string) => {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("uid", uid);
        formData.append("password", password1);

        return await CodePostHTTP.post<PasswordResetResponse, FormData>("/registration/resetPassword/", formData);
    },

    SetCredentials: async (token: string, uid: string, password1: string) => {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("uid", uid);
        formData.append("password1", password1);

        return await CodePostHTTP.post<SetCredentialsResponse, FormData>(`/registration/setCredentials/`, formData);
    },
    GraderToAdmin: async () => {
        await CodePostHTTP.post<{}>(`/registration/graderToAdmin/`, {});
        return true;
    },
};
