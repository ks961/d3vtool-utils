export interface RangeBounded {
    min: (minimum: number) => this;    
    max: (maximum: number) => this;    
}

export type RegExpValidator = {
    error: string
    pattern: string | Function,
}


declare global {

    interface RegExp {
        toString: () => string,
    }
}