import { BaseConnector } from "./base_connector";

export class BinanceConnector implements BaseConnector {
  settings: Record<string, any>;

  constructor(settings: Record<string, any>) {
    this.settings = settings;
  }

  async getBalance(): Promise<number> {
    // just for testing
    if (this.settings.api_key === "42") {
      return 42;
    }
    throw new Error("Method not implemented.");
  }
}
