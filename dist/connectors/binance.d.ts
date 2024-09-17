import { ConnectorSetting } from "..";
import { BaseConnector } from "./base_connector";
export declare class BinanceConnector implements BaseConnector {
    settings: Record<string, ConnectorSetting>;
    constructor(settings: Record<string, ConnectorSetting>);
    getBalance(): Promise<number>;
}
