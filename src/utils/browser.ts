export const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

export const logger = (message?: any, ...optionalParams: any[]) => {
    console.log("[Codepost]", message, ...optionalParams);
};
