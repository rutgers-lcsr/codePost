let BaseErrorMessage = "CodePostAPI Error: ";

export function setBaseError(message: string) {
    BaseErrorMessage = message;
}

export class CodePostError extends Error {
    constructor(message: string, public response?: Response) {
        super(message);
        this.name = "CodePostError";
        this.response = response;
    }
}

export function createError(message: string, response?: Response) {
    const meta = import.meta as any;
    if (Object.keys(meta).includes("env") && meta["env"] && meta["env"].VITE_DEBUG == "true") {
        console.error(message, response);
    }
    if (response) {
        return new CodePostError(`${BaseErrorMessage}${message} - ${response.status} ${response.statusText}`, response);
    }
    const error = new CodePostError(`${BaseErrorMessage}${message}`);
    (error as any).response = response;
    return error;
}
