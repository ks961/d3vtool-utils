import { Validator } from "./utils/validator"

const schema = Validator.number().equalTo(5);

const errors = schema.validateSafely(5);
console.log(errors);
