import { z } from "zod";
import { WebhookModelSchema } from "./schema";

export type WebhookModel = z.infer<typeof WebhookModelSchema>;
