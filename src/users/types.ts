import z from "zod";

import {
    UserSchema,
    UserListSchema,
    UserUpdateSchema,
    EmailRequestSchema,
    EmailSuccessSchema,
    LoginSchema,
} from "./schema";

export type User = z.infer<typeof UserSchema>;
export type UserList = z.infer<typeof UserListSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type Login = z.infer<typeof LoginSchema>;

export type EmailRequest = z.infer<typeof EmailRequestSchema>;
export type EmailSuccess = z.infer<typeof EmailSuccessSchema>;
