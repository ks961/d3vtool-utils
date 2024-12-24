import { SelfValidator } from "./SelfValidator";
import { OptionalValidator } from "./OptionalValidator";
import { ObjectValidationError, ValidationError } from "./error";

export type ObjectType<T> = {[key in keyof T]: T[key]};


export class ObjectValidator<T> {
    #__object__: ObjectType<T>;
    
    constructor(object: ObjectType<T>) {
        this.#__object__ = object;
    }
    
    selfValidator(
        object: any,
        key: string,
        selfValidator: SelfValidator<unknown>
    ): string {

        if(typeof object !== "object") {
            return "'equalsToField' Fn can only be used in the same schema field for comparison. "
        }

        const propertyNameToMatch = selfValidator.getPropertyName();
        
        const providedObjValue = (object as any)[key];

        if(selfValidator.isOptional() && providedObjValue === undefined) return "";
        
        const existingObjValue = (object as any)[propertyNameToMatch];        
    
        if(providedObjValue === existingObjValue) return "";
    
        return selfValidator.getErrorMsg();
    }

    validateSafely(object: unknown) {
        const errorsMap: Record<string, string[]> = {};

        if(typeof object !== "object"){            
            errorsMap["error"] = ["An illegal type was passed, 'object' expected"];
            return errorsMap;
        }

        for(const key in this.#__object__ as Object) {
            const value = (this.#__object__ as any)[key];

            if(value instanceof OptionalValidator) {
    
                const innerObj = value.unwrap();
                
                if(innerObj instanceof SelfValidator) {
                    const errorMsg = this.selfValidator(object, key, innerObj);                    
                    if(errorMsg.length > 0) {
                        errorsMap[key] = [errorMsg];
                    }
                    continue;
                }
            } else if(value instanceof SelfValidator) {
                const errorMsg = this.selfValidator(object, key, value);
                                    
                if(errorMsg.length > 0) {
                    errorsMap[key] = [errorMsg];
                }
                continue;
            }
            
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

            
            if(value instanceof OptionalValidator) {
    
                const innerObj = value.unwrap();
                
                if(innerObj instanceof SelfValidator) {
                    const errorMsg = this.selfValidator(object, key, innerObj);                    
                    if(errorMsg.length > 0) {
                        throw new ObjectValidationError(key, errorMsg);
                    }
                    continue;
                }

                // else if it's optional then validator functions will handle it.
            } else if(value instanceof SelfValidator) {
                const errorMsg = this.selfValidator(object, key, value);
                                    
                if(errorMsg.length > 0) {
                    throw new ObjectValidationError(key, errorMsg);
                }

                continue;
            }
            
            if(typeof value.validate !== "function") {
                throw new ValidationError("Invalid validator object.");
            }
            
            try {
                value.validate((object as any)[key]);
            } catch(err: unknown) {
                if(err instanceof ValidationError) {
                    throw new ObjectValidationError(key, err.message);
                }
            }
        }
    }
}