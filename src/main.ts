// import { Validator, ObjectValidationError, type VInfer } from "./utils/index";
// const schema = Validator.object({
//   name: Validator.number().min(5),
//   email: Validator.string().email(),
//   password: Validator.string().password().min(8),
//   confirmPassword: Validator.string().equalsToField("password").optional(),
// });

// type schema = VInfer<typeof schema>;

// const schemaObj: schema = {
//   name: 12345,
//   email: "email@email.abc",
//   password: "Passwd@123",
//   // confirmPassword: "Passwd@123", // Optional, but must match password if provided
// }

// const errors = schema.validateSafely(schemaObj);

// const schemaClone = schema.clone();
// // or

// try {
//   schema.validate(schemaObj);
// } catch(err: unknown) {
//   if(err instanceof ObjectValidationError) {
//     // do something with it
//     console.log(err);
//   }
// }