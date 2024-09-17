import { ConnectorSetting } from "..";
import { BaseConnector } from "./base_connector";

export class DebankConnector implements BaseConnector {
  settings: Record<string, ConnectorSetting>;

  constructor(settings: Record<string, ConnectorSetting>) {
    this.settings = settings;
  }

  async getBalance(): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
