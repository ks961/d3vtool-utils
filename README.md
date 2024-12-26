# DevTool Utils

A collection of utility functions designed to simplify common tasks in your application

- [**Validator**](#validator-examples)
- [**StringUtils**](#stringutils-examples)

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

## Validator Examples


### 1. String Validation

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


### 2. Number Validation

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


### 3. Simple Object Validation

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


### 4. `optional()` Schema Validation

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

#### Explanation:
1. **`name` field**: This field is required, and it must be a string with a minimum length of 5 characters.
2. **`email` field**: This field is optional due to `.optional()`. If it's provided, it must be a valid email address; if not, the validation will still pass without errors.

#### Example Behavior:
1. If both `name` and `email` are provided, the validation will pass.
2. If only `name` is provided and `email` is omitted, the validation will still pass because `email` is marked as optional.


### 5. Object Validation with Optional and Self-Referencing Fields

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

#### Explanation:
- **`name`**: The `name` field must be a number and have a minimum value of 5.
- **`email`**: The `email` field must be a valid email address.
- **`password`**: The `password` field must be at least 8 characters long and a valid password format.
- **`confirmPassword`**: The `confirmPassword` field is optional but, if provided, must match the value of the `password` field (using `equalsToField("password")`).

In this example, the `validateSafely` function will check the provided `schemaObj` and return any validation errors, ensuring that `confirmPassword` (if present) matches `password`.

## StringUtils Examples

### 1. `toTitleCase(input: string): string`

Converts the input string to title case (each word starts with an uppercase letter and the rest are lowercase).

```ts
import { StringUtils } from "@d3vtool/utils";

const input = "hello world from chatgpt";
const titleCase = StringUtils.toTitleCase(input);

console.log(titleCase); // "Hello World From Chatgpt"
```

---

### 2. `toCamelCase(input: string): string`

Converts the input string to camelCase (first word in lowercase and each subsequent word capitalized).

```ts
import { StringUtils } from "@d3vtool/utils";

const input = "hello world from chatgpt";
const camelCase = StringUtils.toCamelCase(input);

console.log(camelCase); // "helloWorldFromChatgpt"
```

---

### 3. `toPascalCase(input: string): string`

Converts the input string to PascalCase (each word capitalized without spaces).

```ts
import { StringUtils } from "@d3vtool/utils";

const input = "hello world from chatgpt";
const pascalCase = StringUtils.toPascalCase(input);

console.log(pascalCase); // "HelloWorldFromChatgpt"
```

---

### 4. `toKebabCase(input: string): string`

Converts the input string to kebab-case (words separated by hyphens with lowercase letters).

```ts
import { StringUtils } from "@d3vtool/utils";

const input = "hello world from chatgpt";
const kebabCase = StringUtils.toKebabCase(input);

console.log(kebabCase); // "hello-world-from-chatgpt"
```

---

### 5. `isUpperCase(input: string): boolean`

Checks if the input string is entirely in uppercase.

```ts
import { StringUtils } from "@d3vtool/utils";

const input1 = "HELLO WORLD";
const input2 = "Hello World";

const isUpper1 = StringUtils.isUpperCase(input1);
const isUpper2 = StringUtils.isUpperCase(input2);

console.log(isUpper1); // true
console.log(isUpper2); // false
```

---

### 6. `isLowerCase(input: string): boolean`

Checks if the input string is entirely in lowercase.

```ts
import { StringUtils } from "@d3vtool/utils";

const input1 = "hello world";
const input2 = "Hello World";

const isLower1 = StringUtils.isLowerCase(input1);
const isLower2 = StringUtils.isLowerCase(input2);

console.log(isLower1); // true
console.log(isLower2); // false
```

---

### 7. `toAlternateCasing(input: string): string`

Converts the input string to alternate casing, where the characters alternate between uppercase and lowercase.

```ts
import { StringUtils } from "@d3vtool/utils";

const input = "hello world";
const alternateCasing = StringUtils.toAlternateCasing(input);

console.log(alternateCasing); // "HeLlO wOrLd"
```

## JWT Utility Examples

### 1. `signJwt(claims: JwtClaim, customClaims: T, secret: string, options: JwtOptions = { alg: "HS256" }): string`

Signs a JWT (JSON Web Token) with the provided claims, custom claims, secret key, and options.

#### Example Usage

```ts
import { signJwt, createIssueAt, createExpiry } from "@d3vtool/utils";

const claims = {
    aud: "http://localhost:4000",
    iat: createIssueAt(new Date(Date.now())),
    exp: createExpiry("1h"),
    iss: "server-x",
    sub: "user123"
};

const customClaims = {
    role: "admin",
    name: "John Doe"
};

const secret = "itsasecret";

// Sign the JWT with default algorithm (HS256)
const token = signJwt(claims, customClaims, secret);

console.log(token); // Signed JWT token as a string
```

#### Error Handling

The `signJwt` function may throw an error if the signing algorithm specified in `options` is not supported. For example:

```ts
import { signJwt, createIssueAt, createExpiry } from "@d3vtool/utils";

const claims = {
    aud: "http://localhost:4000",
    iat: createIssueAt(new Date(Date.now())),
    exp: createExpiry("1h"),
    iss: "server-x",
    sub: "user123"
};

const customClaims = {
    role: "admin",
    name: "John Doe"
};

const secret = "itsasecret";

// Attempt to sign the JWT with an unsupported algorithm
try {
    const token = signJwt(claims, customClaims, secret, { alg: "HS512" });
    console.log(token);
} catch (error) {
    if (error instanceof BadJwtHeader) {
        console.error(`Error: Unsupported signing algorithm`);
    } else {
        console.error(`Unexpected error:`, error);
    }
}
```

---

### Supported Algorithms for JWT Signing

The following signing algorithms are supported by the `signJwt` function:

- **HS256** (default): HMAC using SHA-256.
- **HS384**: HMAC using SHA-384.
- **HS512**: HMAC using SHA-512.

You can specify which algorithm to use by passing the `alg` option when calling `signJwt`.

#### Example Usage with Custom Signing Algorithm

```ts
import { signJwt, createIssueAt, createExpiry } from "@d3vtool/utils";

const claims = {
    aud: "http://localhost:4000",
    iat: createIssueAt(new Date(Date.now())),
    exp: createExpiry("2h"), // 2hr from now
    iss: "server-x",
    sub: "user123"
};

const customClaims = {
    role: "admin",
    name: "John Doe"
};

const secret = "itsasecret";

// Sign the JWT with HS384 algorithm
const token = signJwt(claims, customClaims, secret, { alg: "HS384" });

console.log(token); // Signed JWT token using HS384
```

#### Error Handling

When using a custom algorithm, ensure that the algorithm is one of the supported ones: **HS256**, **HS384**, or **HS512**. If an unsupported algorithm is passed, an error will be thrown:

```ts
import { signJwt, createIssueAt, createExpiry } from "@d3vtool/utils";

const secret = "itsasecret";
const claims = {
    aud: "http://localhost:4000",
    iat: createIssueAt(new Date(Date.now())),
    exp: createExpiry('1m'),  
    iss: "server-x",
    sub: "testing"
}

try {
    const token = signJwt(claims, { name: "John Doe" }, secret, { alg: "RS256" }); // Unsupported algorithm
} catch (error) {
    if (error instanceof BadJwtHeader) {
        console.error("Error: Unsupported signing algorithm.");
    } else {
        console.error("Unexpected error:", error);
    }
}
```

---

### 2. `verifyJwt<T extends Record<string, string> & Object>(jwt: string, secret: string): JwtClaim & T`

Verifies a JWT and decodes its claims, including both standard JWT claims (like `iat`, `exp`, `iss`) and any custom claims included in the token.

#### Example Usage

```ts
import { verifyJwt } from "@d3vtool/utils";

// Example token (replace with a real token)
const jwt = "your.jwt.token";
const secret = "itsasecret";

// Verify the JWT
const verifiedClaims = verifyJwt(jwt, secret);
console.log(verifiedClaims); // Decoded claims, including standard and custom claims
```

#### Error Handling

The `verifyJwt` function may throw the following errors:

1. **DirtyJwtSignature**: If the JWT signature doesn't match or is invalid.
2. **ExpiredJwt**: If the token has expired (based on the `exp` claim).
3. **InvalidJwt**: If the token is malformed or cannot be decoded properly.

```ts
import { verifyJwt } from "@d3vtool/utils";

const jwt = "your.jwt.token";
const secret = "itsasecret";

try {
    const verifiedClaims = verifyJwt(jwt, secret);
    console.log(verifiedClaims);
} catch (error) {
    if (error instanceof DirtyJwtSignature) {
        console.error("Error: JWT signature is invalid or has been tampered with.");
    } else if (error instanceof ExpiredJwt) {
        console.error("Error: JWT has expired.");
    } else if (error instanceof InvalidJwt) {
        console.error("Error: JWT is malformed or cannot be decoded.");
    } else {
        console.error("Unexpected error:", error);
    }
}
```