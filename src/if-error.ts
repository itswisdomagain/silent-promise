import { SilentPromiseError } from "./index";

class IfError {
    private error: any;
    private errorMessage: string;

    constructor(error: any, errorMessage?: string) {
        this.error = error;
        this.errorMessage = errorMessage;
    }

    /**
     * Executes the specified action if there is an error
     * @param {(error?: any, errorMessage?: string) => void} action Function to execute.
     * Accepts error and errorMessage as optional parameters
     * @returns {IfError}
     */
    public thenDo = (action: (error?: any, errorMessage?: string) => void): IfError => {
        if (this.error) {
            action(this.error, this.errorMessage);
        }
        return this;
    }

    /**
     * Stops code execution in current block by throwing an exception which can be handled by Promise.catch if current
     * block is an async function
     */
    public thenStopExecution = (): void => {
        if (this.error) {
            throw new SilentPromiseError(this.error, this.errorMessage);
        }
    }
}

export = IfError;
