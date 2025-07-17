import { z } from "zod";

export const UserLoginSchema = z.object({
    username: z.string().min(1).max(4096),
    password: z.string().min(1).max(4096),
});

export const SlidingTokenSchema = z.object({
    token: z.string().min(1).max(4096),
});
export const TokenPairSchema = z.object({
    access: z.string().min(1).max(4096),
    refresh: z.string().min(1).max(4096),
});
export const TokenSchema = SlidingTokenSchema.or(TokenPairSchema)

export const AccessTokenSchema = TokenPairSchema.shape.access;
export const RefreshTokenSchema = TokenPairSchema.shape.refresh;

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
