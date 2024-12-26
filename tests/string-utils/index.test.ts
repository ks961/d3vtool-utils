import { describe, it, expect } from "vitest";
import { StringUtils } from "../../src/utils";

describe('StringUtils', () => {
  
    describe('toTitleCase', () => {
      it('should convert a string to title case', () => {
        expect(StringUtils.toTitleCase('hello world')).toBe('Hello World');
      });
  
      it('should handle camelCase input correctly', () => {
        expect(StringUtils.toTitleCase('helloWorld')).toBe('Hello World');
      });
  
      it('should handle hyphenated and underscored input correctly', () => {
        expect(StringUtils.toTitleCase('hello-world_example')).toBe('Hello World Example');
      });
  
      it('should handle empty string input', () => {
        expect(StringUtils.toTitleCase('')).toBe('');
      });
    });
  
    describe('toSnakeCase', () => {
      it('should convert a string to snake_case', () => {
        expect(StringUtils.toSnakeCase('Hello World')).toBe('hello_world');
      });
  
      it('should handle camelCase input correctly', () => {
        expect(StringUtils.toSnakeCase('helloWorld')).toBe('hello_world');
      });
  
      it('should handle hyphenated and underscored input correctly', () => {
        expect(StringUtils.toSnakeCase('hello-world_example')).toBe('hello_world_example');
      });
  
      it('should handle empty string input', () => {
        expect(StringUtils.toSnakeCase('')).toBe('');
      });
    });
  
    describe('toCamelCase', () => {
      it('should convert a string to camelCase', () => {
        expect(StringUtils.toCamelCase('Hello World')).toBe('helloWorld');
      });
  
      it('should handle snake_case and kebab-case input correctly', () => {
        expect(StringUtils.toCamelCase('hello_world')).toBe('helloWorld');
        expect(StringUtils.toCamelCase('hello-world')).toBe('helloWorld');
      });
  
      it('should handle multiple spaces, hyphens, and underscores correctly', () => {
        expect(StringUtils.toCamelCase('hello__world  -    test')).toBe('helloWorldTest');
      });
  
      it('should handle empty string input', () => {
        expect(StringUtils.toCamelCase('')).toBe('');
      });
    });
  
    describe('toPascalCase', () => {
      it('should convert a string to PascalCase', () => {
        expect(StringUtils.toPascalCase('hello world')).toBe('HelloWorld');
      });
  
      it('should handle camelCase input correctly', () => {
        expect(StringUtils.toPascalCase('helloWorld')).toBe('HelloWorld');
      });
  
      it('should handle snake_case and kebab-case input correctly', () => {
        expect(StringUtils.toPascalCase('hello_world')).toBe('HelloWorld');
        expect(StringUtils.toPascalCase('hello-world')).toBe('HelloWorld');
      });
  
      it('should handle empty string input', () => {
        expect(StringUtils.toPascalCase('')).toBe('');
      });
    });
  
    describe('toKebabCase', () => {
      it('should convert a string to kebab-case', () => {
        expect(StringUtils.toKebabCase('Hello World')).toBe('hello-world');
      });
  
      it('should handle camelCase input correctly', () => {
        expect(StringUtils.toKebabCase('helloWorld')).toBe('hello-world');
      });
  
      it('should handle snake_case and spaces correctly', () => {
        expect(StringUtils.toKebabCase('hello_world')).toBe('hello-world');
        expect(StringUtils.toKebabCase('hello world')).toBe('hello-world');
      });
  
      it('should handle empty string input', () => {
        expect(StringUtils.toKebabCase('')).toBe('');
      });
    });
  
    describe('isUpperCase', () => {
      it('should return true for uppercase letters', () => {
        expect(StringUtils.isUpperCase('A')).toBe(true);
      });
  
      it('should return false for lowercase letters', () => {
        expect(StringUtils.isUpperCase('a')).toBe(false);
      });
  
      it('should return false for non-alphabetic characters', () => {
        expect(StringUtils.isUpperCase('1')).toBe(false);
      });
  
      it('should return false for more than one character', () => {
        expect(StringUtils.isUpperCase('HELLO')).toBe(false);
      });
    });
  
    describe('isLowerCase', () => {
      it('should return true for lowercase letters', () => {
        expect(StringUtils.isLowerCase('a')).toBe(true);
      });
  
      it('should return false for uppercase letters', () => {
        expect(StringUtils.isLowerCase('A')).toBe(false);
      });
  
      it('should return false for non-alphabetic characters', () => {
        expect(StringUtils.isLowerCase('1')).toBe(false);
      });
  
      it('should return false for more than one character', () => {
        expect(StringUtils.isLowerCase('hello')).toBe(false);
      });
    });
  
    describe('toAlternateCasing', () => {
      it('should alternate casing for a string', () => {
        expect(StringUtils.toAlternateCasing('hello')).toBe('HELLO');
      });
  
      it('should handle mixed case input', () => {
        expect(StringUtils.toAlternateCasing('HeLLo WoRLd')).toBe('hEllO wOrlD');
      });
  
      it('should handle non-alphabetic characters correctly', () => {
        expect(StringUtils.toAlternateCasing('Hello 123')).toBe('hELLO 123');
      });
  
      it('should return empty string if input is empty', () => {
        expect(StringUtils.toAlternateCasing('')).toBe('');
      });
    });
  
  })