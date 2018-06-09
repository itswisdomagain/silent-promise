import IfError from "./if-error";

export default class PromiseError {
    private error: any;

    public constructor(error?: any) {
        this.error = error;
    }

    public getError(): any {
        return this.error;
    }

    public ifError(errorMessage?: string): IfError {
        return new IfError(this.error, errorMessage);
    }
}
