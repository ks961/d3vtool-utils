import { ValidationError, Validator, type VInfer } from "../dist";

const schema = Validator.object({
  name: Validator.number().min(5),
  email: Validator.string().email(),
});

type Schema = VInfer<typeof schema>;

const schemaObj: Schema = {
  name: 221,
  email: "works@mail.co"
}

try {
  const errors = schema.validate(schemaObj);
  console.log(errors);
} catch(err: unknown) {
  if(err instanceof ValidationError) {
    console.log(err.orignalError);
  }
}
