import { StringUtils } from "../dist";
// import { Validator, ObjectValidationError, type VInfer } from "../dist";

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

// // or

// try {
//   schema.validate(schemaObj);
// } catch(err: unknown) {
//   if(err instanceof ObjectValidationError) {
//     // do something with it
//     console.log(err);
//   }
// }

// const value = Transform.toSnakeCase("Hello--World");
// console.log(value);


console.log(StringUtils.toKebabCase("hello world!"));        // Output: "helloWorld"
console.log(StringUtils.toKebabCase("this_is_a_test"));      // Output: "thisIsATest"
console.log(StringUtils.toKebabCase("Multiple   spaces"));   // Output: "multipleSpaces"
console.log(StringUtils.toKebabCase("hello--world--again")); // Output: "helloWorldAgain"
console.log(StringUtils.toKebabCase("some_variable_here"));