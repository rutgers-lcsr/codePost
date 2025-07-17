let BaseErrorMessage = "CodePostAPI Error: ";

export function setBaseError(message: string) {
    BaseErrorMessage = message;
}

export function createError(message: string, response?: Response) {
    const meta = import.meta as any;
    if (Object.keys(meta).includes("env") && meta["env"] && meta["env"].VITE_DEBUG == "true") {
        console.error(message, response);
    }
    if (response) {
        return new Error(`${BaseErrorMessage}${message} - ${response.status} ${response.statusText}`);
    }
    const error = new Error(`${BaseErrorMessage}${message}`);
    (error as any).response = response;
    return error;
}
