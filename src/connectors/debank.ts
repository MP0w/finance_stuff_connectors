import axios from "axios";
import { CurrencyExchange } from "../currencyExchange";
import { BaseConnector } from "./base_connector";

export class DebankConnector implements BaseConnector {
  private apiKey: string;
  settings: Record<string, any>;
  currencyExchange: CurrencyExchange;

  constructor(
    settings: Record<string, any>,
    currencyExchange: CurrencyExchange
  ) {
    this.settings = settings;
    this.currencyExchange = currencyExchange;
    this.apiKey = settings.api_key;
  }

  balanceTTLSeconds(): number {
    return 60 * 60 * 6;
  }

  cacheKey(): string {
    return this.settings.api_key + this.settings.address;
  }

  async getBalance(): Promise<{ value: number; cost?: number }> {
    try {
      const apiUrl = "https://pro-openapi.debank.com/v1/user/total_balance";

      const response = await axios.get(apiUrl, {
        params: { id: this.settings.address },
        headers: { AccessKey: this.apiKey },
      });

      return {
        value: await this.currencyExchange.convert(
          response.data.total_usd_value,
          "USD",
          this.settings.currency
        ),
      };
    } catch (error) {
      console.error("Error fetching balance from Debank:", error);
      throw new Error("Failed to fetch balance from Debank");
    }
  }
}
