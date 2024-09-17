import { ConnectorSetting } from "..";

export interface BaseConnector {
  settings: Record<string, ConnectorSetting>;

  getBalance(): Promise<number>;
}
