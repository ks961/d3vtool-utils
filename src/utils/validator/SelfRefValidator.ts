import { OptionalValidator } from "./OptionalValidator";

export class SelfRefValidator<T> {
    #errorMsg: string;
    #isOptional: boolean = false;
    #propertyName: string;

    constructor(propertyName: string, errorMsg: string) {
        this.#errorMsg = errorMsg;
        this.#propertyName = propertyName;
    }

    optional(): OptionalValidator<this> {
        this.#isOptional = true;
        return new OptionalValidator<this>(this);
    }
    
    isOptional() {
        return this.#isOptional;
    }

    public getErrorMsg() {
        return this.#errorMsg;
    }

    public getPropertyName() {
        return this.#propertyName;
    }
}