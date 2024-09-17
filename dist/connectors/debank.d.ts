import { ConnectorSetting } from "..";
import { BaseConnector } from "./base_connector";
export declare class DebankConnector implements BaseConnector {
    settings: Record<string, ConnectorSetting>;
    constructor(settings: Record<string, ConnectorSetting>);
    getBalance(): Promise<number>;
}
