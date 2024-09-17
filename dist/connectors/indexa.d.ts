import { ConnectorSetting } from "..";
import { BaseConnector } from "./base_connector";
export declare class IndexaConnector implements BaseConnector {
    settings: Record<string, ConnectorSetting>;
    constructor(settings: Record<string, ConnectorSetting>);
    getBalance(): Promise<number>;
}
