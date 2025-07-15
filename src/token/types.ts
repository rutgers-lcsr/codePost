import { z } from "zod";
import {
    TokenSchema,
    AccessTokenSchema,
    RefreshTokenSchema,
    AccessTokenUpdateSchema,
    AccessTokenUpdateResponseSchema,
} from "./schema";

export type Token = z.infer<typeof TokenSchema>;
export type AccessToken = z.infer<typeof AccessTokenSchema>;
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export type AccessTokenUpdateRequest = z.infer<typeof AccessTokenUpdateSchema>;
export type AccessTokenUpdateResponse = z.infer<
    typeof AccessTokenUpdateResponseSchema
>;
