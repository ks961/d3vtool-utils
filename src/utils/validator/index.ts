import { SelfRefValidator } from "./SelfRefValidator";
import { StringValidator } from "./StringValidator";
import { NumberValidator } from "./NumberValidator";
import { OptionalValidator } from "./OptionalValidator";
import { ObjectValidator } from "./ObjectValidator";
import { ValidationError, ObjectValidationError } from "./error";

export type VInfer<T> = T extends ObjectValidator<infer U>
  ? { 
      [Key in keyof U as VInfer<U[Key]> extends OptionalValidator<infer _> ? Key : never]?: VInfer<U[Key]> extends OptionalValidator<infer X> ? VInfer<X> : VInfer<U[Key]>
    } & {
        [Key in keyof U as VInfer<U[Key]> extends OptionalValidator<infer _> ? never : Key]: VInfer<U[Key]> extends OptionalValidator<infer X> ? VInfer<X> : VInfer<U[Key]>
    }
  : T extends SelfRefValidator<infer U> ? VInfer<U>
  : T extends StringValidator ? string
  : T extends NumberValidator ? number
  : T;


class Validator {

    static string() {
        return new StringValidator();
    }
    
    static number() {
        return new NumberValidator();
    }
    
    static object<T extends Object>(
        object: T,
    ) {
        return new ObjectValidator(object);
    }
}

export {
    Validator,
    ValidationError,
    ObjectValidationError
};