

export class StringUtils {
    
    public static toTitleCase(input: string): string {

        const camelCaseHandled = input.replace(/([a-z])([A-Z])/g, '$1 $2');

        const replacedText = camelCaseHandled.replace(/[-_\s]+/g, " ");
 
        const words = replacedText.split(" ");

        const titleCased = words.map(word => {
            return `${word.charAt(0).toUpperCase()}${word.slice(1, ).toLowerCase()}`;
        }).join(" ");

        return titleCased;
    }

    public static toSnakeCase(input: string): string {
        const camelCaseHandled = input.replace(/([a-z])([A-Z])/g, "$1_$2");
        const snakeCased = camelCaseHandled.replace(/[-_\s]+/g, "_").toLowerCase();

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
        const camelCaseHandled = input.replace(/([a-z])([A-Z])/g, "$1 $2");
        const replacedText = camelCaseHandled.replace(/[-_\s]+/g, " ");
 
        const words = replacedText.split(" ");

        const pascalCased = words.map(word => {
            return word.replace(/(^[a-z])/g, (match) => match.toUpperCase());
        }).join("");

        return pascalCased;
    }

    public static toKebabCase(input: string): string {
        const camelCaseHandled = input.replace(/([a-z])([A-Z])/g, "$1-$2");        
        const kebabCased = camelCaseHandled.replace(/[-_\s]+/g, "-").toLowerCase();
 
        return kebabCased;
    }

    public static isUpperCase(input: string): boolean {
        if(!(input.length === 1) || !isNaN(+input)) return false;

        return (input === input.toUpperCase());
    }
    
    public static isLowerCase(input: string): boolean {
        if(!(input.length === 1) || !isNaN(+input)) return false;
    
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