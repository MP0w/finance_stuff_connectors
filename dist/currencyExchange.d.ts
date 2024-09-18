export interface CurrencyExchanger {
    convert(amount: number, from: "EUR" | "USD", to: "EUR" | "USD"): Promise<number>;
}
export declare class CurrencyExchange implements CurrencyExchanger {
    currencyAPIKey: string;
    cachedExchangeEURUSDRate: number | undefined;
    cachedExchangeEURUSDRateTimestamp: number | undefined;
    constructor(currencyAPIKey: string);
    getExchangeEURUSDRate(): Promise<number>;
    convertEurToUsd(amount: number): Promise<number>;
    convertUsdToEur(amount: number): Promise<number>;
    convert(amount: number, from: "EUR" | "USD", to: "EUR" | "USD"): Promise<number>;
}
