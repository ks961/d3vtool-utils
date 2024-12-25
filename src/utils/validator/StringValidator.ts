import { ValidationError } from "./error";
import { OptionalValidator } from "./OptionalValidator";
import { SelfRefValidator } from "./SelfRefValidator";
import { RangeBounded, RegExpValidator } from "./types";

export class StringValidator implements RangeBounded {

    #validators: RegExpValidator[] = [];
    #isOptional: boolean = false;

    min(
        minimum: number,
        error: string = `The minimum required length is: ${minimum}.`
    ): this {
        this.#validators.push({
            pattern: `^.{${minimum},}$`,
            error,
        });
        return this;
    }
    
    max(
        maximum: number,
        error: string = `The string exceeds the maximum length: ${maximum}.`
    ): this {
        this.#validators.push({
            pattern: `^.{0,${maximum}}$`,
            error
        });
        return this;
    }

    length(
        length: number,
        error: string = `The string is not equal to required length: ${length}.`
    ): this {
        this.#validators.push({
            pattern: `^.{${length}}$`,
            error
        });
       
        return this;
    }

    equalsToField(
        propertyName: string, 
        errorMsg: string = "The provided value is invalid or does not meet the expected criteria."
    ) {        
        return new SelfRefValidator<this>(propertyName, errorMsg);
    }

    email(
        error: string = "Email address is invalid"
    ) {
        this.#validators.push({
            pattern: "(?=^[a-zA-Z]+)[a-zA-Z\%\-\_\.\+0-9]+@[a-zA-Z\-]+\.[a-zA-Z]{2,}$",
            error
        });

        return this;
    }

    password(
        error: string = "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long"
    ) {
        const pattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$";
        
        this.#validators.push({
            pattern: pattern.toString(),
            error
        });

        return this;
    }

    optional(): OptionalValidator<this> {
        this.#isOptional = true;
        return new OptionalValidator<this>(this);
    }

    regex(
        pattern: RegExp,
        error: string,
    ) {
        let regexStr = pattern.toString();
        regexStr = regexStr.slice(1, regexStr.lastIndexOf('/'));

        this.#validators.push({
            pattern: regexStr,
            error
        });

        return this;
    }

    validateSafely(value: unknown): string[] {
        const errors: string[] = [];
        
        if(this.#isOptional && !value) 
            return errors;

        if(typeof value !== "string") {
            errors.push("An illegal type was passed, 'string' expected.")
            return errors;
        }

        for(const validator of this.#validators) {
            const regex = new RegExp(validator.pattern);
            
            if(!regex.test(value))
                errors.push(validator.error);
        }

        return errors;
    }
   
    validate(value: unknown): boolean {
        if(this.#isOptional && !value) 
            return true;
        
        if(typeof value !== "string") {
            throw new ValidationError("An illegal type was passed, 'string' expected.");
        }
        for(const validator of this.#validators) {
            const regex = new RegExp(validator.pattern);
            if(!regex.test(value))
                throw new ValidationError(validator.error);
        }

        return true;
    }
}