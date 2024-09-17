import { BaseConnector } from "./connectors/base_connector";
type AccountType = "fiat" | "investment";
type ConnectorSetting = "string" | "number" | "boolean";
type ConnectorId = "binance" | "indexa" | "debank";
type Connector = {
    id: ConnectorId;
    name: string;
    type: AccountType;
    icon: string | undefined;
    settings: {
        key: string;
        hint: string;
        extraInstructions?: string;
        type: ConnectorSetting;
    }[];
};
declare const connectorSettings: Connector[];
declare function getConnector(id: ConnectorId, settings: Record<string, ConnectorSetting>): BaseConnector;
export { connectorSettings, getConnector };
export type { Connector, ConnectorId, ConnectorSetting, BaseConnector };
