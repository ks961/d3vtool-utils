import { SelfRefValidator } from "./SelfRefValidator";
import { OptionalValidator } from "./OptionalValidator";
import { ObjectValidationError, ValidationError } from "./error";

export class ObjectValidator<T extends Object> {
    #__object__: T;
    
    constructor(object: T) {
        this.#__object__ = object;
    }

    public clone(): T {
        return structuredClone ? 
            structuredClone(this.#__object__) : 
                JSON.parse(JSON.stringify(this.#__object__));
    }
    
    selfRefValidator(
        object: any,
        key: string,
        reference: SelfRefValidator<unknown>
    ): string | undefined {

        if(typeof object !== "object") {
            return "'equalsToField' Fn can only be used in the same schema field for comparison. "
        }

        const propertyNameToMatch = reference.getPropertyName();
        
        const providedObjValue = (object as any)[key];

        if(reference.isOptional() && providedObjValue === undefined) return;
        
        const propertyNameToMatchValue = (object as any)[propertyNameToMatch];        
    
        if(providedObjValue === propertyNameToMatchValue) 
            return;
    
        return reference.getErrorMsg();
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
                
                if(innerObj instanceof SelfRefValidator) {
                    const errorMsg = this.selfRefValidator(object, key, innerObj);                    
                    if(errorMsg) {
                        errorsMap[key] = [errorMsg];
                    }
                    continue;
                }
            } else if(value instanceof SelfRefValidator) {
                const errorMsg = this.selfRefValidator(object, key, value);
                                    
                if(errorMsg) {
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
                
                if(innerObj instanceof SelfRefValidator) {
                    const errorMsg = this.selfRefValidator(object, key, innerObj);                    
                    if(errorMsg) {
                        throw new ObjectValidationError(key, errorMsg);
                    }
                    continue;
                }

            // else if it's optional then validator functions will handle it.
            } else if(value instanceof SelfRefValidator) {
                const errorMsg = this.selfRefValidator(object, key, value);
                                    
                if(errorMsg) {
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