import { BaseConnector } from "./base_connector";
export declare class HackConnector implements BaseConnector {
    private settings;
    constructor(settings: Record<string, any>);
    getBalance(): Promise<{
        value: number;
        cost?: number;
    }>;
}
