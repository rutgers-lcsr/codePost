import { z } from "zod";
import {
    TokenSchema,
    AccessTokenSchema,
    RefreshTokenSchema,
    AccessTokenUpdateSchema,
    AccessTokenUpdateResponseSchema,
    UserLoginSchema,
    SlidingTokenSchema,
    TokenPairSchema,
} from "./schema";
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type SlidingToken = z.infer<typeof SlidingTokenSchema>;
export type TokenPair = z.infer<typeof TokenPairSchema>;
export type Token = z.infer<typeof TokenSchema>;
export type AccessToken = z.infer<typeof AccessTokenSchema>;
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export type AccessTokenUpdateRequest = z.infer<typeof AccessTokenUpdateSchema>;
export type AccessTokenUpdateResponse = z.infer<
    typeof AccessTokenUpdateResponseSchema
>;
