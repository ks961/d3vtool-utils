
export class OptionalValidator<T> {
    private obj: T;

    constructor(obj: T) {
        this.obj = obj;
    }

    unwrap() {
        return this.obj;
    }

    validateSafely(value: unknown) {
        return (this.obj as any).validateSafely(value);
    }

    validate(value: unknown) {
        (this.obj as any).validate(value);
    }
}