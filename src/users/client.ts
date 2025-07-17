import z from "zod";
import { CodePostHTTP } from "../http";
import { EmailSuccessSchema, UserSchema } from "./schema";
import { EmailRequest, EmailSuccess, User, UserUpdate } from "./types";
import { BasicFunctions, getQueryParams, QueryListParams } from "../api";



export const Users = {
    ...BasicFunctions<User, true>("/users/", UserSchema, true),
    emailUser: async (email: string, options: EmailRequest) =>
        await CodePostHTTP.post<EmailSuccess, EmailRequest>(
            `/users/${email}/email/`,
            options,
            EmailSuccessSchema,
        ),
    updateMe: async (options: UserUpdate) =>
        await CodePostHTTP.patch<User, UserUpdate>(
            `/users/me/`,
            options,
            UserSchema,
        ),
    me: async () => await CodePostHTTP.get<User>("/users/me/", {}, UserSchema),
    requestAPIToken: async () => {
        const user = await CodePostHTTP.post<User>(
            "/users/requestAPIToken",
            {},
            UserSchema,
        );
        return user.api_token;
    },
};
