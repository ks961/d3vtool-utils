import { signJwt, verifyJwt, createExpiry, createIssueAt } from "../../src/utils/jwt/index"; 
import { BadJwtClaimObj, BadJwtHeader, DirtyJwtSignature, ExpiredJwt, InvalidJwt } from "../../src/utils/jwt/errors";
import { describe, it, expect, vi } from 'vitest';

const secret = 'itsasecret';

describe('JWT Tests', () => {
    
    // Helper function for comparing test results
    function assertEquals(actual: any, expected: any) {
        expect(actual).toBe(expected);
    }

    // 1. Valid JWT signing and verification with default algorithm (HS256)
    it('should sign and verify JWT with default algorithm (HS256)', () => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date(Date.now())),
            exp: createExpiry("1h"),
            iss: "server-x",
            sub: "user123"
        };

        const customClaims = { role: "admin", name: "John Doe" };

        const token = signJwt(claims, customClaims, secret);
        const decoded = verifyJwt(token, secret);

        assertEquals(decoded.sub, claims.sub);
        assertEquals(decoded.role, customClaims.role);
        assertEquals(decoded.name, customClaims.name);
    });

    // 2. Valid JWT signing and verification with custom algorithm (HS384)
    it('should sign and verify JWT with custom algorithm (HS384)', () => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date(Date.now())),
            exp: createExpiry("1h"),
            iss: "server-x",
            sub: "user123"
        };

        const customClaims = { role: "user", name: "Jane Doe" };

        const token = signJwt(claims, customClaims, secret, { alg: "HS384" });
        const decoded = verifyJwt(token, secret);

        assertEquals(decoded.sub, claims.sub);
        assertEquals(decoded.role, customClaims.role);
        assertEquals(decoded.name, customClaims.name);
    });

    // 3. Invalid signing algorithm should throw BadJwtHeader
    it('should throw BadJwtHeader for unsupported signing algorithm', () => {
        try {
            const claims = {
                aud: "http://localhost:4000",
                iat: createIssueAt(new Date(Date.now())),
                exp: createExpiry("1h"),
                iss: "server-x",
                sub: "user123"
            };
            const customClaims = { role: "admin" };

            // @ts-ignore
            signJwt(claims, customClaims, secret, { alg: "RS256" });
            throw new Error("Expected error for unsupported algorithm");
        } catch (error) {
            expect(error).toBeInstanceOf(BadJwtHeader);
        }
    });

    // 4. Valid token with expired `exp` claim should throw ExpiredJwt
    it('should throw ExpiredJwt for expired token', async () => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date(Date.now())),
            exp: createExpiry("1s"), // Expired immediately
            iss: "server-x",
            sub: "user123"
        };
        const customClaims = { role: "admin" };
        const token = signJwt(claims, customClaims, secret);

        // Simulate delay and then verify token
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            verifyJwt(token, secret);
            throw new Error("Expected ExpiredJwt error");
        } catch (error) {
            expect(error).toBeInstanceOf(ExpiredJwt);
        }
    });

    // 5. Invalid JWT (malformed token) should throw InvalidJwt
    it('should throw InvalidJwt for malformed token', () => {
        const token = "invalid.jwt.token";
        try {
            verifyJwt(token, secret);
            throw new Error("Expected InvalidJwt error");
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidJwt);
        }
    });

    // 6. Token with invalid signature should throw BadJwtSignature
    it('should throw BadJwtSignature for tampered token', () => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date(Date.now())),
            exp: createExpiry("1h"),
            iss: "server-x",
            sub: "user123"
        };
        const customClaims = { role: "admin" };
        const token = signJwt(claims, customClaims, secret);

        // Modify token to simulate signature tampering
        const tamperedToken = token + "tampered";

        try {
            verifyJwt(tamperedToken, secret);
            throw new Error("Expected BadJwtSignature error");
        } catch (error) {
            expect(error).toBeInstanceOf(DirtyJwtSignature);
        }
    });

    // 7. Verify a token with a valid `exp` claim (not expired)
    it('should verify token with valid expiry', () => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date(Date.now())),
            exp: createExpiry("1h"),
            iss: "server-x",
            sub: "user123"
        };
        const customClaims = { role: "admin", name: "John Doe" };

        const token = signJwt(claims, customClaims, secret);
        const decoded = verifyJwt(token, secret);

        assertEquals(decoded.sub, claims.sub);
        assertEquals(decoded.role, customClaims.role);
        assertEquals(decoded.name, customClaims.name);
    });

    // 8. Token with missing `exp` claim should throw error
    it('should throw BadJwtClaimObj for missing `exp` claim', () => {
        try {
            const claims = {
                aud: "http://localhost:4000",
                iat: createIssueAt(new Date(Date.now())),
                iss: "server-x",
                sub: "user123"
            };
            const customClaims = { role: "admin" };

            // @ts-ignore
            signJwt(claims, customClaims, secret); // Missing `exp`
            throw new Error("Expected BadJwtClaimObj error");
        } catch (error) {
            expect(error).toBeInstanceOf(BadJwtClaimObj);
        }
    });

    // 9. Token with custom claims successfully added
    it('should add and verify custom claims successfully', () => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date(Date.now())),
            exp: createExpiry("1h"),
            iss: "server-x",
            sub: "user123"
        };
        const customClaims = { role: "admin", department: "IT" };

        const token = signJwt(claims, customClaims, secret);
        const decoded = verifyJwt(token, secret);

        assertEquals(decoded.role, customClaims.role);
        assertEquals(decoded.department, customClaims.department);
    });

    // 10. Handling of empty claims and custom claims
    it('should handle empty custom claims properly', () => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date(Date.now())),
            exp: createExpiry("1h"),
            iss: "server-x",
            sub: "user123"
        };
        const customClaims = {}; // Empty custom claims

        const token = signJwt(claims, customClaims, secret);
        const decoded = verifyJwt(token, secret);

        assertEquals(decoded.sub, claims.sub);
        expect(Object.keys(decoded).length).toBe(5); // Only claim properties
    });
});
