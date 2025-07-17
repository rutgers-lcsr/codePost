import { getQueryParams } from "../api";
import { CodePostHTTP } from "../http";
import { User } from "../users";
import {
    EmailRegisterResponse,
    HandleValidationResponse,
    RegisterAndSetPasswordResponse,
    SetCredentialsResponse,
    ValidateMoocSignupResponse,
    ValidateNewAdminUserResponse,
    VerifyRegistrationTokenResponse,
} from "./types";

export const RegistrationClient = {
    CurrentUser: async () => {
        return await CodePostHTTP.get<User & { token: string }>("/registration/current_user/");
    },
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
    ValidateMoocSignup: async (email: string) => {
        const formData = new FormData();
        formData.append("email", email);

        await CodePostHTTP.post<ValidateMoocSignupResponse, FormData>(`/registration/validateMoocSignup/`, formData);
    },
    ValidateNewAdminUser: async (email: string, organization: string) => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("organization", organization);
        await CodePostHTTP.post<ValidateNewAdminUserResponse, FormData>(`/registration/validateNewAdminUser/`, formData);
    },
    HandleValidationResponse: async (token: string, uid: string, activate: boolean) => {
        const params = getQueryParams({
            token: token,
            uid: uid,
            activate: activate,
        });

        await CodePostHTTP.get<HandleValidationResponse>(`/registration/handleValidationResponse/`, params);
    },
};
