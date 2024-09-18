import { CurrencyExchange } from "../currencyExchange";
import { BaseConnector } from "./base_connector";
export declare class IndexaConnector implements BaseConnector {
    settings: Record<string, any>;
    currencyExchange: CurrencyExchange;
    constructor(settings: Record<string, any>, currencyExchange: CurrencyExchange);
    getBalance(): Promise<number>;
}
