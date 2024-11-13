import { ValidationError } from "./error";

export type ObjectType<T> = {[key in keyof T]: T[key]};


export class ObjectValidator<T> {
    #__object__: ObjectType<T>;
    
    constructor(object: ObjectType<T>) {
        this.#__object__ = object;
    }

    validateSafely(object: unknown) {
        const errorsMap: Record<string, string[]> = {};

        if(typeof object !== "object"){            
            errorsMap["error"] = ["An illegal type was passed, 'object' expected"];
            return errorsMap;
        }

        for(const key in this.#__object__ as Object) {
            const value = (this.#__object__ as any)[key];

            if(typeof value.validateSafely !== "function") {
                throw new ValidationError("Invalid validator object.");
            }

            const errors = value.validateSafely((object as any)[key]);

            if(errors.length > 0) 
                errorsMap[key] = errors;
        }

        return errorsMap;
    }

    validate(object: unknown) {
        if(typeof object !== "object")
            throw new ValidationError("An illegal type was passed, 'object' expected");

        for(const key in this.#__object__ as Object) {
            const value = (this.#__object__ as any)[key] as any;
            
            if(typeof value.validate !== "function") {
                throw new ValidationError("Invalid validator object.");
            }
            
            try {
                value.validate((object as any)[key]);
            } catch(err) {
                if(err instanceof ValidationError) {
                    throw new ValidationError(`Field '${key}' validation failed: ${err.message}`);
                }
            }
        }
    }
}