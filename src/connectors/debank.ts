import axios from "axios";
import { CurrencyExchange } from "../currencyExchange";
import { BaseConnector } from "./base_connector";

export class DebankConnector implements BaseConnector {
  private apiKey: string;
  settings: Record<string, any>;
  currencyExchange: CurrencyExchange;

  constructor(
    apiKey: string,
    settings: Record<string, any>,
    currencyExchange: CurrencyExchange
  ) {
    this.settings = settings;
    this.currencyExchange = currencyExchange;
    this.apiKey = apiKey;
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
