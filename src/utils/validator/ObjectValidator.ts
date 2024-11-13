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
                throw new Error("Invalid validator object.");
            }

            const errors = value.validateSafely((object as any)[key]);

            if(errors.length > 0) 
                errorsMap[key] = errors;
        }

        return errorsMap;
    }

    validate(object: unknown) {
        if(typeof object !== "object")
            throw new Error("An illegal type was passed, 'object' expected");

        for(const key in this.#__object__ as Object) {
            const value = (this.#__object__ as any)[key] as any;
            
            if(typeof value.validate !== "function") {
                throw new Error("Invalid validator object.");
            }

            value.validate((object as any)[key]);
        }
    }
}