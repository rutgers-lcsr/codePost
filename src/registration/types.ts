import { z } from "zod";
import {
    AdminCheckStatusResponseSchema,
    EmailRegisterResponseSchema,
    HandleValidationResponseSchema,
    PasswordResetEmailResponseSchema,
    PasswordResetResponseSchema,
    RegisterAndSetPasswordResponseSchema,
    ValidateMoocSignupResponseSchema,
    ValidateNewAdminUserResponseSchema,
    VerifyRegistrationTokenResponseSchema,
    VerifyResetTokenResponseSchema,
} from "./schema";

export type EmailRegisterResponse = z.infer<typeof EmailRegisterResponseSchema>;

export type VerifyRegistrationTokenResponse = z.infer<typeof VerifyRegistrationTokenResponseSchema>;

export type RegisterAndSetPasswordResponse = z.infer<typeof RegisterAndSetPasswordResponseSchema>;
export type SetCredentialsResponse = z.infer<typeof RegisterAndSetPasswordResponseSchema>;
export type ValidateMoocSignupResponse = z.infer<typeof ValidateMoocSignupResponseSchema>;
export type ValidateNewAdminUserResponse = z.infer<typeof ValidateNewAdminUserResponseSchema>;
export type HandleValidationResponse = z.infer<typeof HandleValidationResponseSchema>;
export type AdminCheckStatusResponse = z.infer<typeof AdminCheckStatusResponseSchema>;
export type PasswordResetEmailResponse = z.infer<typeof PasswordResetEmailResponseSchema>;
export type VerifyResetTokenResponse = z.infer<typeof VerifyResetTokenResponseSchema>;
export type PasswordResetResponse = z.infer<typeof PasswordResetResponseSchema>;
