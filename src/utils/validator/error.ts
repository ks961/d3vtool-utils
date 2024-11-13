
export class ValidationError extends Error {
    public orignal?: string;
    constructor(message?: string) {
        super(message);
        this.orignal = message;
    }
}