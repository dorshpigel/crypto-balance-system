export interface Rate {
    [key: string]: number;
    last_updated_at: number;
}

export interface RatesCache {
    [key: string]: Rate | number;
    __timestamp: number;
}

export type Balance = Record<string, number>;