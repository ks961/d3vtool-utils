import { describe, it, expect } from "vitest";
import { Validator } from "../../dist";

describe("String Validator", () => {

    const minReqChars = 10;
    const username = "popHero83";
    const stringSchema = Validator.string().min(minReqChars);
    

    describe('Validation functions', () => {
        it("'validateSafely' should return array of errors on validation fails", () => {        
            const errors = stringSchema.validateSafely(username);
    
            const isArray = Array.isArray(errors);
            
            expect(isArray).toBe(true);
        });
    
        
        it("'validate' should throw error on insufficient characters passed for validation or failed validation", () => {
    
            expect(() => stringSchema.validate(username))
                .toThrowError(`The minimum required length is: ${minReqChars}.`);
        });
    });

    describe('Illegal type validation', () => {
        it("'validateSafely' should return error on passing illegal types", () => {
            const errors = stringSchema.validateSafely(33);
            
            expect(errors).toHaveLength(1);
            
            expect(errors[0])
                .toBe("An illegal type was passed, 'string' expected.");
        });
    
        it("'validate' should throw error on passing illegal types", () => {
            expect(() => stringSchema.validate(33))
                .toThrow();
        });
    });


    describe('Minimum char required validation', () => {
        it(`'username' should have minimum of 5 chars`, () => {
            const usernameSchema = Validator.string().min(5)
            
            const errors = usernameSchema.validateSafely(username);        
            expect(errors).toHaveLength(0);
    
            expect(() => usernameSchema.validate(username))
                .not.throw();
        });
    });

    describe('Maximum char required validation', () => {

        it(`'username' should have maximum of 10 chars`, () => {
            const usernameSchema = Validator.string().max(10)
            
            const errors = usernameSchema.validateSafely(username);        
            
            expect(errors).toHaveLength(0);

            expect(() => usernameSchema.validate(username))
                .not.throw();
        });
        
        it(`should throw and return error if chars exceeds maximum of 10 chars`, () => {

            const schema = Validator.string().max(10)
            const localTestStr = "1234567890Hero";

            const errors = schema.validateSafely(localTestStr);
            
            expect(errors).toHaveLength(1);

            expect(() => schema.validate(localTestStr))
                .toThrow();
        });
    })

    
    describe('Email validation', () => {

        const schema = Validator.string().email();
        const invalidEmail = "1234567890Hero";
      
        it("should return a list of errors for an invalid email", () => {
            const errors = schema.validateSafely(invalidEmail);
        
            expect(errors).toHaveLength(1);
        
            expect(errors[0]).toBe("Email address is invalid");
        });    

        it("should throw an error for an invalid email", () => {    
            expect(() => schema.validate(invalidEmail))
                .toThrow();
        });

        it("should not throw an error for a valid email", () => {
    
            const schema = Validator.string().email();
    
            const localTestStr = "mail@mail.co";
    
            const errors = schema.validateSafely(localTestStr);
            
            expect(errors).toHaveLength(0);
    
            expect(() => schema.validate(localTestStr))
                .not.throw()
        });
    });

    describe('Password validation', () => {

        const schema = Validator.string().password();
        const data = "password";
      
        it("should return a list of errors for an invalid password", () => {
            const errors = schema.validateSafely(data);
            
            expect(errors).toHaveLength(1);
        
            expect(errors[0]).toBe("Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long");
        });    

        it("should throw an error for an invalid password", () => {    
            expect(() => schema.validate(data))
                .toThrow();
        });

        it("should not throw an error for a valid password", () => {
    
            const schema = Validator.string().password();
    
            const localTestStr = "P4sswd@8909";
    
            const errors = schema.validateSafely(localTestStr);
            
            expect(errors).toHaveLength(0);
    
            expect(() => schema.validate(localTestStr))
                .not.throw()
        });
    });

    describe('Regex validation', () => {

        const schema = Validator.string().regex(
            /[a-z]{10}/,
            "Allowed character are [a-z], max length is 10 chars"
        );
        const data = "password";
      
        it("should return a list of errors", () => {
            const errors = schema.validateSafely(data);
            
            expect(errors).toHaveLength(1);
        
            expect(errors[0]).toBe("Allowed character are [a-z], max length is 10 chars");
        });

        it("should throw an error", () => {    
            expect(() => schema.validate(data))
                .toThrow();
        });

        it("should not throw an error", () => {
    
            const schema = Validator.string().regex(
                /^[a-z]{0,10}$/,
                "Allowed character are [a-z], max length is 10 chars"
            );
    
            const localTestStr = "abcdefghij";
    
            const errors = schema.validateSafely(localTestStr);
            console.log(errors);
            
                    
            // expect(errors).toHaveLength(0);
    
            // expect(() => schema.validate(localTestStr))
            //     .not.throw()
        });
    });
});