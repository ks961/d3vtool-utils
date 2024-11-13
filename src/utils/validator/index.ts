import { NumberValidator } from "./NumberValidator";
import { ObjectType, ObjectValidator } from "./ObjectValidator";
import { OptionalValidator } from "./OptionalValidator";
import { StringValidator } from "./StringValidator";

export type VInfer<T> = T extends ObjectValidator<infer U>
  ? { 
      [Key in keyof U as VInfer<U[Key]> extends OptionalValidator<infer _> ? Key : never]?: VInfer<U[Key]> extends OptionalValidator<infer X> ? VInfer<X> : VInfer<U[Key]>
    } & {
        [Key in keyof U as VInfer<U[Key]> extends OptionalValidator<infer _> ? never : Key]: VInfer<U[Key]> extends OptionalValidator<infer X> ? VInfer<X> : VInfer<U[Key]>
    }
  : T extends StringValidator ? string
  : T extends NumberValidator ? number
  : T;


export class Validator {

    static string() {
        return new StringValidator();
    }

    static number() {
        return new NumberValidator();
    }

    static object<T>(
        object: ObjectType<T>,
    ) {
        return new ObjectValidator(object);
    }
}