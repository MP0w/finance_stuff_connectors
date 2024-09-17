import { BaseConnector } from "./base_connector";
export declare class BinanceConnector implements BaseConnector {
    settings: Record<string, any>;
    constructor(settings: Record<string, any>);
    getBalance(): Promise<number>;
}
