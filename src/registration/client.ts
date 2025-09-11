import { getQueryParams } from "../api";
import { Auth } from "../auth";
import { CodePostHTTP } from "../http";
import { User } from "../users";
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
        const currentUser = await CodePostHTTP.get<User & { token: string }>("/registration/current_user/");

        if (currentUser.token) {
            // Set the token for authenticated requests
            Auth.setToken(currentUser.token);
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
