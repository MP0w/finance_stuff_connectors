import { BaseConnector } from "./base_connector";

export class DebankConnector implements BaseConnector {
  settings: Record<string, any>;

  constructor(settings: Record<string, any>) {
    this.settings = settings;
  }

  async getBalance(): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
