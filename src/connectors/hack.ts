import { BaseConnector } from "./base_connector";

export class HackConnector implements BaseConnector {
  private settings: Record<string, any>;

  constructor(settings: Record<string, any>) {
    this.settings = settings;
  }

  async getBalance(): Promise<{ value: number; cost?: number }> {
    if (!this.settings.url) {
      throw new Error("URL is required");
    }
    const response = await fetch(this.settings.url);
    const data = await response.json();

    return {
      value: data.value,
      cost: data.cost,
    };
  }
}
