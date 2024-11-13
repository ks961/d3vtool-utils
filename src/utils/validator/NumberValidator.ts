import { RangeBounded, RegExpValidator } from "./types";

export class NumberValidator implements RangeBounded {

    #validators: RegExpValidator[] = [];

    min(
        minimum: number,
        error: string = "The minimum required length has not been met."
    ): this {
        this.#validators.push({
            pattern: `^[0-9]{${minimum},}$`,
            error,
        });
        return this;
    }
    
    max(
        maximum: number,
        error: string = "The string exceeds the maximum allowed length."
    ): this {
        this.#validators.push({
            pattern: `^[0-9]{0,${maximum}}$`,
            error
        });
        return this;
    }

    length(
        length: number,
        error: string = "The string is not equal to required length."
    ): this {
        this.#validators.push({
            pattern: `^[0-9]{${length}}$`,
            error
        });
       
        return this;
    }

    regex(
        pattern: RegExp,
        error: string,
    ) {
        this.#validators.push({
            pattern: pattern.toString(),
            error
        });

        return this;
    }

    validateSafely(value: unknown): string[] {
        const errors: string[] = [];

        if(typeof value !== "number") {
            errors.push("An illegal type was passed, 'number' expected.")
            return errors;
        }

        for(const validator of this.#validators) {
            const regex = new RegExp(validator.pattern);
            if(!regex.test(value.toString()))
                errors.push(validator.error);
        }

        return errors;
    }
   
    validate(value: unknown): boolean {

        if(typeof value !== "number") {
            throw new Error("An illegal type was passed, 'number' expected.")
        }
        
        for(const validator of this.#validators) {
            const regex = new RegExp(validator.pattern);
            if(!regex.test(value.toString()))
                throw new Error(validator.error);
        }

        return true;
    }
}