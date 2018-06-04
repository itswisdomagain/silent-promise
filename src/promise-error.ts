import IfError from "./if-error";

class PromiseError {
    private error: any;

    constructor(error?: any) {
        this.error = error;
    }

    public getError(): any {
        return this.error;
    }

    public ifError(errorMessage?: string): IfError {
        return new IfError(this.error, errorMessage);
    }
}

export = PromiseError;
