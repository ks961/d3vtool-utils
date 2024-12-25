

export class StringUtils {
    
    public static toTitleCase(input: string): string {
        const replacedText = input.replace(/[-_\s]+/g, " ");
 
        const words = replacedText.split(" ");

        const titleCased = words.map(word => {
            return `${word.charAt(0).toUpperCase()}${word.slice(1, ).toLowerCase()}`;
        }).join(" ");

        return titleCased;
    }

    public static toSnakeCase(input: string): string {
        const snakeCased = input.replace(/[-_\s]+/g, "_").toLowerCase();

        return snakeCased;
    }

    public static toCamelCase(input: string): string {
        const replacedText = input.replace(/[-_\s]+/g, " ");

        const words = replacedText.split(" ");

        const camelCased = words.map((word, index) => {
            if(index === 0) {
                return word.toLowerCase();
            } else {
                return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
            }
        }).join("");

        return camelCased;
    }

    public static toPascalCase(input: string): string {
        const replacedText = input.replace(/[-_\s]+/g, " ");
 
        const words = replacedText.split(" ");

        const pascalCased = words.map(word => {
            return `${word.charAt(0).toUpperCase()}${word.slice(1, ).toLowerCase()}`;
        }).join("");

        return pascalCased;
    }

    public static toKebabCase(input: string): string {
        const kebabCased = input.replace(/[-_\s]+/g, "-").toLowerCase();
 
        return kebabCased;
    }

    public static isUpperCase(input: string): boolean {
        if(!(input.length === 1)) return false;

        return (input === input.toUpperCase());
    }
    
    public static isLowerCase(input: string): boolean {
        if(!(input.length === 1)) return false;
    
        return (input === input.toLowerCase());
    }

    public static toAlternateCasing(
        input: string, 
    ): string {
        let result = [];

        for(let i = 0; i < input.length; ++i) {
            result.push(
                this.isUpperCase(input[i]) ?
                input[i].toLowerCase() :  input[i].toUpperCase()
            );
        }

        return result.join("");
    }
}