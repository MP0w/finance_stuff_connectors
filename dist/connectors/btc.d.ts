import { CurrencyExchange } from "../currencyExchange";
import { BaseConnector } from "./base_connector";
export declare class BTCConnector implements BaseConnector {
    private settings;
    private currencyExchange;
    constructor(settings: Record<string, any>, currencyExchange: CurrencyExchange);
    getBTCPrice(): Promise<number>;
    getBalance(): Promise<{
        value: number;
        cost?: number;
    }>;
}
