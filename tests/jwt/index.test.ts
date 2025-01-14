import { signJwt, verifyJwt, createExpiry, createIssueAt } from "../../src/utils/jwt/index"; 
import { BadJwtClaim, BadJwtHeader, DirtyJwtSignature, ExpiredJwt, InvalidJwt } from "../../src/utils/jwt/errors";
import { describe, it, expect, vi } from 'vitest';

const secret = 'itsasecret';

describe('JWT Tests', async() => {
    
    // Helper function for comparing test results
    function assertEquals(actual: any, expected: any) {
        expect(actual).toBe(expected);
    }

    // 1. Valid JWT signing and verification with default algorithm (HS256)
    it('should sign and verify JWT with default algorithm (HS256)', async() => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date()),
            exp: createExpiry("1h"),
            iss: "server-x",
            sub: "user123"
        };

        const customClaims = { role: "admin", name: "John Doe" };

        const token = await signJwt(claims, customClaims, secret);
        const decoded = await verifyJwt(token, secret);

        assertEquals(decoded.sub, claims.sub);
        assertEquals(decoded.role, customClaims.role);
        assertEquals(decoded.name, customClaims.name);
    });

    // 2. Valid JWT signing and verification with custom algorithm (HS384)
    it('should sign and verify JWT with custom algorithm (HS384)', async() => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date()),
            exp: createExpiry("1h"),
            iss: "server-x",
            sub: "user123"
        };

        const customClaims = { role: "user", name: "Jane Doe" };

        const token = await signJwt(claims, customClaims, secret, { alg: "HS384" });
        const decoded = await verifyJwt(token, secret);

        assertEquals(decoded.sub, claims.sub);
        assertEquals(decoded.role, customClaims.role);
        assertEquals(decoded.name, customClaims.name);
    });

    // 3. Invalid signing algorithm should throw BadJwtHeader
    it('should throw BadJwtHeader for unsupported signing algorithm', async() => {
        try {
            const claims = {
                aud: "http://localhost:4000",
                iat: createIssueAt(new Date()),
                exp: createExpiry("1h"),
                iss: "server-x",
                sub: "user123"
            };
            const customClaims = { role: "admin" };

            // @ts-ignore
            await signJwt(claims, customClaims, secret, { alg: "RS256" });
            throw new Error("Expected error for unsupported algorithm");
        } catch (error) {
            expect(error).toBeInstanceOf(BadJwtHeader);
        }
    });

    // 4. Valid token with expired `exp` claim should throw ExpiredJwt
    it('should throw ExpiredJwt for expired token', async() => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date()),
            exp: createExpiry("1s"), // Expired immediately
            iss: "server-x",
            sub: "user123"
        };
        const customClaims = { role: "admin" };
        const token = await signJwt(claims, customClaims, secret);

        // Simulate delay and then verify token
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            await verifyJwt(token, secret);
            throw new Error("Expected ExpiredJwt error");
        } catch (error) {
            expect(error).toBeInstanceOf(ExpiredJwt);
        }
    });

    // 5. Invalid JWT (malformed token) should throw InvalidJwt
    it('should throw InvalidJwt for malformed token', async() => {
        const token = "invalid.jwt.token";
        try {
            await verifyJwt(token, secret);
            throw new Error("Expected InvalidJwt error");
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidJwt);
        }
    });

    // 6. Token with invalid signature should throw BadJwtSignature
    it('should throw DirtyJwtSignature for tampered token', async() => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date()),
            exp: createExpiry("1h"),
            iss: "server-x",
            sub: "user123"
        };
        const customClaims = { role: "admin" };
        const token = await signJwt(claims, customClaims, secret);

        // Modify token to simulate signature tampering
        const tamperedToken = token + "tampered";

        try {
            await verifyJwt(tamperedToken, secret);
        } catch (error) {            
            expect(error).toBeInstanceOf(DirtyJwtSignature);
        }
    });

    // 7. Verify a token with a valid `exp` claim (not expired)
    it('should verify token with valid expiry', async() => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date()),
            exp: createExpiry("1h"),
            iss: "server-x",
            sub: "user123"
        };
        const customClaims = { role: "admin", name: "John Doe" };

        const token = await signJwt(claims, customClaims, secret);
        const decoded = await verifyJwt(token, secret);

        assertEquals(decoded.sub, claims.sub);
        assertEquals(decoded.role, customClaims.role);
        assertEquals(decoded.name, customClaims.name);
    });

    // 8. Token with missing `exp` claim should throw error
    it('should throw BadJwtClaim for missing `exp` claim', async() => {
        try {
            const claims = {
                aud: "http://localhost:4000",
                iat: createIssueAt(new Date()),
                iss: "server-x",
                sub: "user123"
            };
            const customClaims = { role: "admin" };

            // @ts-ignore
            await signJwt(claims, customClaims, secret); // Missing `exp`
            throw new Error("Expected BadJwtClaim error");
        } catch (error) {
            expect(error).toBeInstanceOf(BadJwtClaim);
        }
    });

    // 9. Token with custom claims successfully added
    it('should add and verify custom claims successfully', async() => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date()),
            exp: createExpiry("1h"),
            iss: "server-x",
            sub: "user123"
        };
        const customClaims = { role: "admin", department: "IT" };

        const token = await signJwt(claims, customClaims, secret);
        const decoded = await verifyJwt(token, secret);

        assertEquals(decoded.role, customClaims.role);
        assertEquals(decoded.department, customClaims.department);
    });

    // 10. Handling of empty claims and custom claims
    it('should handle empty custom claims properly', async() => {
        const claims = {
            aud: "http://localhost:4000",
            iat: createIssueAt(new Date()),
            exp: createExpiry("1h"),
            iss: "server-x",
            sub: "user123"
        };
        const customClaims = {}; // Empty custom claims

        const token = await signJwt(claims, customClaims, secret);
        const decoded = await verifyJwt(token, secret);

        assertEquals(decoded.sub, claims.sub);
        expect(Object.keys(decoded).length).toBe(5); // Only claim properties
    });
});
