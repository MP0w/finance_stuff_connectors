import { CurrencyExchange } from "../currencyExchange";
import { BaseConnector } from "./base_connector";
export declare class DebankConnector implements BaseConnector {
    private apiKey;
    settings: Record<string, any>;
    currencyExchange: CurrencyExchange;
    constructor(apiKey: string, settings: Record<string, any>, currencyExchange: CurrencyExchange);
    getBalance(): Promise<{
        value: number;
        cost?: number;
    }>;
}
