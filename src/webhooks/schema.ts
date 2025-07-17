import { z } from "zod";

export const WebhookModelSchema = z.object({
    id: z.number(),
    course: z.number(),
    event: z.string().max(64),
    target: z.url().max(255),
    is_active: z.boolean().default(true),
    last_triggered_at: z.string().nullable(),
    last_triggered_status: z.string().max(255).nullable().optional(),
});
