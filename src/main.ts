import { ValidationError, Validator, type VInfer } from "../dist";

const usernameSchema = Validator.string().max(5);

type Username = VInfer<typeof usernameSchema>;

const username: Username = "popHse";

const errors = usernameSchema.validateSafely(username)

console.log(errors);

// or

try {
  usernameSchema.validate(username);
} catch(err: unknown) {
  if(err instanceof ValidationError) {
    // do something with it
    console.log(err);
  }
}