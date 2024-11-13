
export class ValidationError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

export class ObjectValidationError extends Error {
    public key: string;
    constructor(key: string, message?: string) {
        super(message);
        this.key = key;
    }
}