export function createError(message: string, response?: Response) {
    const meta = import.meta as any;
    if (
        Object.keys(meta).includes("env") &&
        meta["env"] &&
        meta["env"].VITE_DEBUG == "true"
    ) {
        console.error(message, response);
    }
    if (response) {
        return new Error(
            `CodePostAPI Error: ${message} - ${response.status} ${response.statusText}`,
        );
    }
    return new Error(`CodePostAPI Error: ${message}`);
}
