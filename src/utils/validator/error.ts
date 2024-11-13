
export class ValidationError extends Error {
    public orignalError?: string;
    constructor(errorMsg?: string) {
        super(errorMsg);
        this.orignalError = errorMsg;
    }
}