import { CurrencyExchange } from "../currencyExchange";
import { BaseConnector } from "./base_connector";
export declare class IndexaConnector implements BaseConnector {
    private currencyExchange;
    private settings;
    constructor(settings: Record<string, any>, currencyExchange: CurrencyExchange);
    getBalance(): Promise<{
        value: number;
        cost?: number;
    }>;
}
