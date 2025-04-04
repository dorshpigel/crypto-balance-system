export interface rate {
    [key: string]: number;
    last_updated_at: number;
}

export interface ratesCache {
    [key: string]: rate | number;
    __timestamp: number;
}