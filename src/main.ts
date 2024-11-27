import { ValidationError, Validator, type VInfer } from "../dist";

const schema = Validator.object({
  name: Validator.number().min(5),
  email: Validator.string().email(),
  password: Validator.string().password("1 of all chars")
});

type Schema = VInfer<typeof schema>;

const schemaObj: Schema = {
  name: 392911,
  email: "works@mail.co",
  password: "P4sswd@ss"
}


try {
  schema.validate(schemaObj);
} catch(err: unknown) {
  console.log("err:", err);
  
  if(err instanceof ValidationError) {
    console.log(err.message);
  }
}
