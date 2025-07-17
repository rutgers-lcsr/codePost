import z from "zod";

export const HandleValidationResponseSchema = z.object({
    isValid: z.boolean().optional(),
    message: z.string().optional(),
    errors: z.record(z.string(), z.any()).optional(),
});

export const RegistrationTokenResponseSchema = z.object({
    isValid: z.boolean(),
    errors: z.record(z.string(), z.any()).optional(),
});
export const RegisterResponseSchema = z.object({
    success: z.boolean(),
    errors: z.record(z.string(), z.any()).optional(),
});
export const ValidateMoocSignupResponseSchema = RegisterResponseSchema.extend({
    action_id: z.string().optional(),
});
export const ValidateNewAdminUserResponseSchema = RegisterResponseSchema.extend({
    action_id: z.string().optional(),
});

export const EmailRegisterResponseSchema = RegisterResponseSchema.extend({
    code_valid: z.boolean(),
    email_valid: z.boolean(),
});

export const VerifyRegistrationTokenResponseSchema = RegistrationTokenResponseSchema.extend({
    email: z.email().optional(),
});

export const RegisterAndSetPasswordResponseSchema = RegistrationTokenResponseSchema;
export const setCredentialsResponseSchema = RegistrationTokenResponseSchema;
