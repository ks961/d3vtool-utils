import { Validator, type VInfer } from "../dist";

const schema = Validator.object({
  name: Validator.number().min(5).optional(),
  email: Validator.string().email(),
});

type Schema = VInfer<typeof schema>;

const schemaObj: Schema = {
  // name: "Leonardo",
  email: "works@mail.co"
}

const errors = schema.validateSafely(schemaObj);

console.log(errors);