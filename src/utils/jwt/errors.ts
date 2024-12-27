export class InvalidJwt extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidJwt"
    }
}

export class ExpiredJwt extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ExpiredJwt"
    }
}

export class DirtyJwtSignature extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DirtyJwtSignature"
    }
}

export class BadJwtHeader extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadJwtHeader"
    }
}

export class BadJwtClaim extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadJwtClaim";
    }
}