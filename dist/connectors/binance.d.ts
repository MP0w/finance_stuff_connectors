import { CurrencyExchange } from "../currencyExchange";
import { BaseConnector } from "./base_connector";
export declare class BinanceConnector implements BaseConnector {
    private client;
    private settings;
    private currencyExchange;
    constructor(settings: Record<string, any>, currencyExchange: CurrencyExchange);
    getBalance(): Promise<number>;
    getBTCBalance(type?: string): Promise<number>;
    convertBTC(btcAmount: number): Promise<number>;
}
