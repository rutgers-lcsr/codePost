import { CodePostHTTP } from "../http";
import { BasicFunctions } from "../api";
import { WebhookModelSchema } from "./schema";
import { WebhookModel } from "./types";

export const Webhooks = {
    ...BasicFunctions<WebhookModel>("/webhooks", WebhookModelSchema),
};
