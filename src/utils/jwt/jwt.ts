import crypto from "crypto";
import { Branded } from "../helpers";
import { BadJwtClaimObj, BadJwtHeader, DirtyJwtSignature, ExpiredJwt, InvalidJwt } from "./errors";

export type JwtHeader = {
    alg: "HS256" | "HS384" | "HS512",
    typ: "JWT"
}

export type Time = 
    `${number}s` | 
    `${number}m` | 
    `${number}h` | 
    `${number}d` | 
    `${number}y`;

const Time_Multiplier: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    y: 365 * 24 * 60 * 60 * 1000
}

type Expiry = Branded<number, "Expiry">;
type IssuedAt = Branded<number, "IssuedAt">;

/**
 * Converts a given `Date` object into an `IssuedAt` timestamp (milliseconds since the Unix epoch).
 * 
 * This function takes a `Date` object representing the issue date and returns the corresponding 
 * Unix timestamp, which can be used as the "iat" (issued at) claim in a JWT or other time-based calculations.
 * 
 * The `iat` (issued at) claim represents the timestamp of when the token was created. This function 
 * ensures the conversion from a `Date` object to the corresponding timestamp in milliseconds.
 *
 * @param iat - A `Date` object representing the issue date (the moment when the token is created).
 * @returns An `IssuedAt` value, which is the Unix timestamp (in milliseconds) of the `iat` date.
 * 
 * @example
 * // Example usage: creating an 'issued at' timestamp from the current date
 * const issuedAt = createIssueAt(new Date());
 * console.log(issuedAt); // The timestamp of the current date and time
 *
 * @example
 * // Example usage: creating an 'issued at' timestamp from a specific date
 * const issuedAt = createIssueAt(new Date('2024-01-01T00:00:00Z'));
 * console.log(issuedAt); // The timestamp for January 1, 2024
 */
export function createIssueAt(iat: Date): IssuedAt {
    return iat.getTime() as IssuedAt;
}

/**
 * Creates an expiry time based on the given time string.
 * The expiry is calculated as the current time plus the time duration specified in the `expiry` parameter.
 * 
 * The `expiry` parameter can be a time duration string such as:
 * - `${number}s` for seconds
 * - `${number}m` for minutes
 * - `${number}h` for hours
 * - `${number}d` for days
 * - `${number}y` for years
 * 
 * The function converts the given time string into a valid expiration timestamp, which can be used for JWT expiration or other time-based calculations.
 *
 * @param expiry - The time duration (e.g., `"5m"`, `"1h"`, `"2d"`, `"1y"`) that specifies how long from the current time the expiry will occur.
 * @returns An `Expiry` value (number), which represents the calculated expiration time in milliseconds from the Unix epoch.
 * 
 * @example
 * // Create an expiry 5 minutes from now
 * const expiry = createExpiry("5m");
 * 
 * @example
 * // Create an expiry 1 day from now
 * const expiry = createExpiry("1d");
 */
export function createExpiry(expiry: Time): Expiry {
    const time = parseInt(expiry);
    const unit = expiry.charAt(expiry.length - 1);

    const expiryDate = new Date(Date.now() + time * Time_Multiplier[unit]);
    
    return expiryDate.getTime() as Expiry;
}

export type JwtClaim = {
    iat: IssuedAt,
    exp: Expiry,
    aud: string, // audience
    sub: string, // subject
    iss: string, // issuer
}
const RequiredClaimProps = [
    "iat",
    "exp",
    "aud",
    "sub",
    "iss",
] as const;

export type ValidJwt = [
    b64Header: string,
    b64Payload: string,
    b64Signature: string,
]

type JwtOptions = {
    alg: JwtHeader["alg"]
}

// async function generateECKeyPair() {
//     const pair = await generateKeyPair('ec', {
//         namedCurve: "P-256"
//     });

//     return pair;
// }

const AcceptedSigningAlgo: Set<JwtHeader["alg"]> = new Set([
    "HS256",
    "HS384",
    "HS512"
]);

const algoMap: Record<JwtHeader["alg"], string> = {
    "HS256": 'sha256',
    "HS384": 'sha384',
    "HS512": 'sha512',
}

function signWithSecret(
    algorithm: JwtHeader["alg"],
    encodedHP: string, 
    secret: string
) {

    const hmac = crypto.createHmac(algoMap[algorithm], secret)
        .update(encodedHP);

    
    const signature = hmac.digest('base64url');

    return signature;
}

/**
 * Signs a JWT (JSON Web Token) with the provided claims, custom claims, secret key, and options.
 * 
 * This function creates a JWT token by encoding the claims (standard and custom), 
 * signing it with the provided secret key using the specified algorithm, and returning the resulting 
 * token as a string. This JWT can then be used for authentication or authorization purposes.
 * 
 * The `claims` parameter represents standard JWT claims (such as `iat`, `exp`, `iss`, etc.). The `customClaims` 
 * allows you to include additional, user-defined claims. The `secret` is used to sign the token and ensure its integrity. 
 * The `options` parameter allows specifying the signing algorithm and any future configuration needs.
 * 
 * **JWT Structure:**
 * The JWT consists of three parts: header, payload (claims), and signature.
 * The header typically includes information about the signing algorithm (`alg`), and the payload holds the claims.
 * The signature is created by encoding the header and payload and signing it with the secret.
 * 
 * @param claims - The standard JWT claims (e.g., `iat`, `exp`, `aud`, `sub`, `iss`, etc.). These claims are predefined in the JWT specification.
 * @param customClaims - Additional, user-defined claims. These are included in the payload alongside the standard claims.
 * @param secret - The secret key used to sign the JWT. This should be kept secure and never exposed.
 * @param options - Options for signing the JWT. Currently, this only supports specifying the `alg` (signing algorithm), defaulting to `"HS256"`.
 * 
 * @returns A signed JWT as a string, consisting of the base64url-encoded header, payload, and signature.
 * 
 * @throws {BadJwtHeader} If an unsupported signing algorithm is specified in the `options` parameter.
 * 
 * @example
 * // Example usage: signing a JWT with standard claims and a custom claim
 * const jwt = signJwt(
 *   {
 *     aud: "http://localhost:4000",
 *     iat: createIssueAt(new Date(Date.now())),
 *     exp: createExpiry("1h"),
 *     iss: "server-x",
 *     sub: "testing"
 *   },
 *   { name: "test" },
 *   "itsasecret"
 * );
 * console.log(jwt); // The signed JWT token
 * 
 * @example
 * // Example usage: signing a JWT with custom signing algorithm (HS512)
 * const jwt = signJwt(
 *   {
 *     aud: "http://localhost:4000",
 *     iat: createIssueAt(new Date(Date.now())),
 *     exp: createExpiry("2h"),
 *     iss: "server-x",
 *     sub: "user"
 *   },
 *   { role: "admin" },
 *   "secret",
 *   { alg: "HS512" } // optional
 * );
 * console.log(jwt); // The signed JWT token with HS512 algorithm
 */
export function signJwt<T extends Record<string, string> & Object>(
    claims: JwtClaim, 
    customClaims: T,
    secret: string,
    options: JwtOptions = {
        alg: "HS256",
    },
): string {
    
    if(!AcceptedSigningAlgo.has(options.alg)) {
        throw new BadJwtHeader(`Bad Header: Unsupported signing algorithm "${options.alg}"`);
    }

    const base64Header = Buffer.from(JSON.stringify({
        alg: options.alg,
        typ: "JWT",
    }), 'utf8')
        .toString("base64url");

    const missingPropIndex = RequiredClaimProps.findIndex(prop => !(prop in claims));
    if(missingPropIndex >= 0) {
        throw new BadJwtClaimObj(`Invalid Claim: The claim object is missing the required property '${RequiredClaimProps[missingPropIndex]}`);
    }

    const base64Payload = Buffer.from(JSON.stringify({
        ...claims,
        ...customClaims
    }), 'utf8').toString("base64url");

    const base64EncodedHP = `${base64Header}.${base64Payload}`;
    
    const base64EncodedSig = signWithSecret(
        options.alg,
        base64EncodedHP, 
        secret
    );

    const jwt = `${base64EncodedHP}.${base64EncodedSig}`;

    return jwt;
}

function isValidJwt(jwt: string): ValidJwt  {
    const jwtArray = jwt.trim().split(".");

    if (jwtArray.length !== 3) {
        throw new InvalidJwt("Invalid JWT: JWT must have exactly 3 parts (header, payload, and signature).");
    }

    return jwtArray as ValidJwt;
}

function b64UrlToUtf8(b64String: string) {
    const b64 = Buffer.from(b64String, "base64url").toString("base64");
    try {
        return atob(b64);
    } catch {
        throw new InvalidJwt("Base64 decoding failed: Invalid Base64 URL string.")
    }
}

function parseJwtSegment<R>(
    value: string,
    segment: string,
): R {
    try {
        return JSON.parse(value);
    } catch {
        throw new InvalidJwt(`Invalid JWT ${segment}: Failed to parse the ${segment}. This usually occurs if the ${segment} is not a valid JSON object or is improperly Base64 encoded. Ensure that the ${segment} is correctly Base64 URL encoded and contains valid JSON.`);
    }
}

/**
 * Verifies a JWT (JSON Web Token) by decoding and validating its signature using the provided secret key.
 * 
 * This function decodes the JWT, validates its signature using the provided `secret`, and returns the payload 
 * of the token, which includes the standard JWT claims (e.g., `iat`, `exp`, `iss`, etc.) as well as any custom claims 
 * included in the token. If the JWT is invalid or the signature doesn't match, an error will be thrown.
 * 
 * The JWT is decoded and the claims are returned as a combination of the standard claims (JWT claim) and the custom claims 
 * that were included in the token. This can be used to check if the token is valid, and to retrieve the associated information 
 * (such as the user’s identity or permissions).
 * 
 * @param jwt - The JWT string to be verified, which contains the base64url-encoded header, payload, and signature.
 * @param secret - The secret key used to validate the JWT's signature. This key should match the one used during token signing.
 * 
 * @returns The decoded payload, including both the standard JWT claims (e.g., `iat`, `exp`, `iss`) and any custom claims that were passed during signing.
 * 
 * @throws {BadJwtSignature} If the JWT signature does not match or the JWT is otherwise invalid.
 * @throws {ExpiredJwt} If the JWT is expired (based on the `exp` claim).
 * @throws {InvalidJwt} If the JWT is malformed or cannot be decoded properly.
 * 
 * @example
 * // Example usage: verifying a JWT and accessing its claims
 * const verifiedPayload = verifyJwt<CustomClaimType>(
 *   "your.jwt.token",
 *   "itsasecret"
 * );
 * console.log(verifiedPayload); // The decoded claims, including standard and custom claims
 * 
 * @example
 * // Example usage with a specific claim (e.g., `name` claim) from the payload
 * const verifiedPayload = verifyJwt<CustomClaimType>(
 *   "your.jwt.token",
 *   "itsasecret"
 * );
 * console.log(verifiedPayload.name); // Access the custom `name` claim from the token
 */
export function verifyJwt<T extends Record<string, string> & Object>(
    jwt: string,
    secret: string
): JwtClaim & T {
    const [
        base64EncodedHeader, 
        base64EncodedPayload,
        base64EncodedSig
    ] = isValidJwt(jwt);

    
    const serializedHeader = b64UrlToUtf8(base64EncodedHeader);
    const decodedHeader = parseJwtSegment<JwtHeader>(serializedHeader, "Header");

    if(!AcceptedSigningAlgo.has(decodedHeader.alg)) {
        throw new BadJwtHeader(`Invalid JWT Header: Unsupported signing algorithm "${decodedHeader.alg}"`)
    }


    const serializedPayload = b64UrlToUtf8(base64EncodedPayload);
    const decodedPayload = parseJwtSegment<(JwtClaim & T)>(serializedPayload, "Payload");

    if(Date.now() > decodedPayload.exp) {
        throw new ExpiredJwt("Expired JWT: Token has expired.");
    }

    const base64EncodedHP = `${base64EncodedHeader}.${base64EncodedPayload}`;

    const b64signature = signWithSecret(
        decodedHeader.alg,
        base64EncodedHP,
        secret
    );

    if(b64signature !== base64EncodedSig) {
        throw new DirtyJwtSignature("Invalid JWT: Signature verification failed");
    }
    
    return decodedPayload;
}