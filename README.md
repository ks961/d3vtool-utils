# DevTool Utils

A collection of utility functions designed to simplify common tasks in your application

## Installation

To install, you can use npm or yarn:

```bash
npm install @d3vtool/utils
or
yarn add @d3vtool/utils
```

## Usage

1. String Validation

```ts
import { Validator, type VInfer } from "@d3vtool/utils";

const usernameSchema = Validator.string().min(5);

type Username = VInfer<typeof usernameSchema>;

const username: Username = "popHero83";

const errors = usernameSchema.validateSafely(username)

console.log(errors);
```

2. Number Validation

```ts
import { Validator, type VInfer } from "@d3vtool/utils";

const phoneSchema = Validator.number().min(1).max(10);

type Phone = VInfer<typeof phoneSchema>;

const phone: Phone = 1234567890;

const errors = phoneSchema.validateSafely(phone)

console.log(errors);
```

3. Simple Object Validation

```ts
import { Validator, type VInfer } from "@d3vtool/utils";

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
```