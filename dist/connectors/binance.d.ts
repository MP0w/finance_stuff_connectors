import { BaseConnector } from "./base_connector";
export declare class BinanceConnector implements BaseConnector {
    private client;
    settings: Record<string, any>;
    constructor(settings: Record<string, any>);
    getBalance(): Promise<number>;
    getBTCBalance(type?: string): Promise<number>;
    convertBTC(btcAmount: number): Promise<number>;
}
