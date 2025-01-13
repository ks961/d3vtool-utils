import { ValidationError } from "./error";
import { OptionalValidator } from "./OptionalValidator";
import { SelfRefValidator } from "./SelfRefValidator";
import { RangeBounded, RegExpValidator } from "./types";

export class NumberValidator implements RangeBounded {

    #validators: RegExpValidator[] = [];
    #isOptional: boolean = false;

    min(
        minimum: number,
        error: string = `The minimum required length is: ${minimum}.`
    ): this {
        this.#validators.push({
            pattern: `^[0-9]{${minimum},}$`,
            error,
        });
        return this;
    }
    
    max(
        maximum: number,
       error: string = `The value exceeds the maximum length: ${maximum}.`
    ): this {
        this.#validators.push({
            pattern: `^[0-9]{0,${maximum}}$`,
            error
        });
        return this;
    }

    length(
        length: number,
        error: string = `The value is not equal to required length: ${length}.`
    ): this {
        this.#validators.push({
            pattern: `^[0-9]{${length}}$`,
            error
        });
       
        return this;
    }

    greaterThan(
        rhs: number, 
        error: string = `Value must be greater than '${rhs}'`
    ) {
        this.#validators.push({
            pattern: (lhs: number) => lhs > rhs,
            error,
        });
        return this;
    }

    lessThan(
        rhs: number, 
        error: string = `Value must be less than '${rhs}'`
    ) {
        this.#validators.push({
            pattern: (lhs: number) => lhs < rhs,
            error,
        });
        return this;
    }

    equalTo(
        rhs: number, 
        error: string = "Values must be equal"
    ) {
        this.#validators.push({
            pattern: (lhs: number) => lhs === rhs,
            error,
        });
        
        return this;
    }

    notEqualTo(
        rhs: number, error: 
        string = "Values must not be equal"
    ) {
        this.#validators.push({
            pattern: (lhs: number) => lhs !== rhs,
            error,
        });
    }

    greaterThanOrEqual(
        rhs: number, 
        error: string = `Value must be greater or equal to '${rhs}'`
    ) {
        this.#validators.push({
            pattern: (lhs: number) => lhs >= rhs,
            error,
        });

        return this;
    }

    lessThanOrEqual(
        rhs: number, 
        error: string = `Value must be less or equal to '${rhs}'`
    ) {
        this.#validators.push({
            pattern: (lhs: number) => lhs <= rhs,
            error,
        });

        return this;
    }

    equalsToField(
        propertyName: string, 
        errorMsg: string = "The provided value is invalid or does not meet the expected criteria."
    ) {        
        return new SelfRefValidator<this>(propertyName, errorMsg);
    }

    optional(): OptionalValidator<this> {
        this.#isOptional = true;
        return new OptionalValidator<this>(this);
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

        if(this.#isOptional && !value) 
            return errors;

        if(typeof value !== "number") {
            errors.push("An illegal type was passed, 'number' expected.")
            return errors;
        }

        for(const validator of this.#validators) {
            if(validator.pattern instanceof Function) {
                const result = validator.pattern(value);
                if(!result)
                    errors.push(validator.error);
            } else {
                const regex = new RegExp(validator.pattern);
                if(!regex.test(value.toString()))
                    errors.push(validator.error);
            }
        }

        return errors;
    }
   
    validate(value: unknown): boolean {

        if(this.#isOptional && !value) 
            return true;

        if(typeof value !== "number") {
            throw new ValidationError("An illegal type was passed, 'number' expected.")
        }
        
        for(const validator of this.#validators) {
            if(validator.pattern instanceof Function) {
                const result = validator.pattern(value);
                if(!result)
                    throw new ValidationError(validator.error);
            } else {
                const regex = new RegExp(validator.pattern);
                if(!regex.test(value.toString()))
                    throw new ValidationError(validator.error);
            }
        }

        return true;
    }
}