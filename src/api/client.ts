import { CodePostHTTP } from "../http";

export const API = {
    health: async () => {
        try {
            await CodePostHTTP.get("/health-check");
            return true;
        } catch {
            return false;
        }
    },
};
