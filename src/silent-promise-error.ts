export class SilentPromiseError {
    public error: any;
    public message: string;

    constructor(error: any, message: string) {
        this.error = error;
        this.message = message;
    }
}
