import { Validator, type VInfer } from "../dist";

const schema = Validator.object({
  name: Validator.string().min(5).optional(),
  email: Validator.string().email(),
});

type Schema = VInfer<typeof schema>;

const schemaObj: Schema = {
  name: "Leonardo",
  email: "email@email.abc"
}

const errors = schema.validateSafely(schemaObj);

console.log(errors);