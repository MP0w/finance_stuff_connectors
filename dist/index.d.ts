import { BaseConnector } from "./connectors/base_connector";
import { CurrencyExchange } from "./currencyExchange";
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
export type ConnectorProviderConfig = {
    debankAPIKey: string;
    currencyAPIKey: string;
};
export declare class ConnectorProvider {
    currencyExchange: CurrencyExchange;
    config: ConnectorProviderConfig;
    constructor(config: ConnectorProviderConfig);
    connectorSettings: Connector[];
    getConnector(id: ConnectorId, settings: Record<string, any>): BaseConnector;
}
export type { Connector, ConnectorId, ConnectorSetting };
