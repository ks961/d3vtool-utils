# DevTool Utils

A collection of utility functions designed to simplify common tasks in your application

## Installation

You can install the package using npm or yarn:

### npm

```bash
npm install @d3vtool/hooks
```

### yarn

```bash
yarn add @d3vtool/hooks
```

## Usage

1. String Validation

```ts
import { Validator, ValidationError, type VInfer } from "@d3vtool/utils";

const usernameSchema = Validator.string().min(5);

type Username = VInfer<typeof usernameSchema>;

const username: Username = "popHero83";

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
```

2. Number Validation

```ts
import { Validator, ValidationError, type VInfer } from "@d3vtool/utils";

const phoneSchema = Validator.number().length(10);

type Phone = VInfer<typeof phoneSchema>;

const phone: Phone = 1234567890;

const errors = phoneSchema.validateSafely(phone)

console.log(errors);

// or

try {
  phoneSchema.validate(phone);
} catch(err: unknown) {
  if(err instanceof ValidationError) {
    // do something with it
    console.log(err);
  }
}
```

3. Simple Object Validation

```ts
import { Validator, ObjectValidationError, type VInfer } from "@d3vtool/utils";

const schema = Validator.object({
  name: Validator.string().min(5),
  email: Validator.string().email(),
});

type schema = VInfer<typeof schema>;

const schemaObj: schema = {
  name: "Sudhanshu",
  email: "email@email.abc"
}

const errors = schema.validateSafely(schemaObj);
console.log(errors);

// or

try {
  schema.validate(schemaObj);
} catch(err: unknown) {
  if(err instanceof ObjectValidationError) {
    // do something with it
    console.log(err);
  }
}
```

4. `optional()` Schema Validation

```ts
import { Validator, ObjectValidationError, type VInfer } from "@d3vtool/utils";

const schema = Validator.object({
  name: Validator.string().min(5), // name is required with a minimum length of 5
  email: Validator.string().email().optional(), // email is optional
});

type schema = VInfer<typeof schema>;

const schemaObj: schema = {
  name: "Sudhanshu",
  email: "email@email.abc", // This is valid, but email can also be omitted
};

const errors = schema.validateSafely(schemaObj);
console.log(errors); // Should show no errors

// or
try {
  schema.validate(schemaObj);
} catch(err: unknown) {
  if(err instanceof ObjectValidationError) {
    // do something with it
    console.log(err);
  }
}

// Example with email missing
const schemaObjWithoutEmail: schema = {
  name: "Sudhanshu",
  // email is omitted, which is allowed because it's optional
};

const errorsWithoutEmail = schema.validateSafely(schemaObjWithoutEmail);
console.log(errorsWithoutEmail); // Should show no errors as email is optional

// or 

try {
  schema.validate(schemaObjWithoutEmail);
} catch(err: unknown) {
  if(err instanceof ObjectValidationError) {
    // do something with it
    console.log(err);
  }
}
```

### Explanation:
1. **`name` field**: This field is required, and it must be a string with a minimum length of 5 characters.
2. **`email` field**: This field is optional due to `.optional()`. If it's provided, it must be a valid email address; if not, the validation will still pass without errors.

### Example Behavior:
- If both `name` and `email` are provided, the validation will pass.
- If only `name` is provided and `email` is omitted, the validation will still pass because `email` is marked as optional.

5. Object Validation with Optional and Self-Referencing Fields

```ts
import { Validator, ObjectValidationError, type VInfer } from "@d3vtool/utils";

const schema = Validator.object({
  name: Validator.number().min(5),
  email: Validator.string().email(),
  password: Validator.string().password().min(8),
  confirmPassword: Validator.string().equalsToField("password").optional(),
});

type schema = VInfer<typeof schema>;

const schemaObj: schema = {
  name: 12345,
  email: "email@email.abc",
  password: "securepassword123",
  confirmPassword: "securepassword123", // Optional, but must match password if provided
}

const errors = schema.validateSafely(schemaObj);

// or

try {
  schema.validate(schemaObj);
} catch(err: unknown) {
  if(err instanceof ObjectValidationError) {
    // do something with it
    console.log(err);
  }
}
```

### Explanation:
- **`name`**: The `name` field must be a number and have a minimum value of 5.
- **`email`**: The `email` field must be a valid email address.
- **`password`**: The `password` field must be at least 8 characters long and a valid password format.
- **`confirmPassword`**: The `confirmPassword` field is optional but, if provided, must match the value of the `password` field (using `equalsToField("password")`).

In this example, the `validateSafely` function will check the provided `schemaObj` and return any validation errors, ensuring that `confirmPassword` (if present) matches `password`.