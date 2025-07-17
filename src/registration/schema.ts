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


export const AdminCheckStatusValidResponseSchema = z.object({
      pending: z.boolean(),
    status: z.boolean(),
});
export const AdminCheckStatusinValidResponseSchema = z.object({
    errors: z.record(z.string(), z.any()).optional(),
});

export const AdminCheckStatusResponseSchema = AdminCheckStatusValidResponseSchema.or(AdminCheckStatusinValidResponseSchema);

export const PasswordResetEmailResponseSchema = z.object({
    success: z.boolean(),
    errors: z.record(z.string(), z.any()).optional(),
});
export const VerifyResetTokenResponseSchema = z.object({
    isValid: z.boolean(),
    email: z.email().optional(),
});

export const PasswordResetResponseSchema = z.object({
    success: z.boolean(),
    isValid: z.boolean(),
})