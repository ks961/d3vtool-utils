import { createExpiry, createIssueAt, signJwt, verifyJwt } from "./utils/jwt";

const secret = "itsasecret";

const claims = {
    aud: "http://localhost:4000",
    iat: createIssueAt(new Date()),
    exp: createExpiry("1h"),
    iss: "server-x",
    sub: "user123"
};

const customClaims = { role: "admin", name: "John Doe" };

const token = await signJwt(claims, customClaims, secret);

// console.log(token);

const decoded = await verifyJwt(token, secret);
