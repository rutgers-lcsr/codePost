import { z } from "zod";

export const UserLoginSchema = z.object({
    username: z.string().min(1).max(4096),
    password: z.string().min(1).max(4096),
});

export const TokenSchema = z.object({
    access: z.string().min(1).max(4096),
    refresh: z.string().min(1).max(4096),
});

export const AccessTokenSchema = TokenSchema.shape.access;
export const RefreshTokenSchema = TokenSchema.shape.refresh;

export const AccessTokenUpdateSchema = z.object({
    refresh: z.string().min(1).max(4096),
});
export const AccessTokenUpdateResponseSchema = z.object({
    access: z.string().min(1).max(4096),
    refresh: z.string().min(1).max(4096).optional(),
});
export const VerifyTokenSchema = z.object({
    token: z.string().min(1).max(4096),
});
export const VerifyTokenResponseSchemaError = z.object({
    detail: z.string().min(1).max(4096),
    code: z.string().min(1).max(4096).optional(),
});
