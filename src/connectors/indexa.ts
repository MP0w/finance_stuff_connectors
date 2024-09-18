import { CurrencyExchange } from "../currencyExchange";
import { BaseConnector } from "./base_connector";

export class IndexaConnector implements BaseConnector {
  settings: Record<string, any>;
  currencyExchange: CurrencyExchange;

  constructor(
    settings: Record<string, any>,
    currencyExchange: CurrencyExchange
  ) {
    this.settings = settings;
    this.currencyExchange = currencyExchange;
  }

  async getBalance(): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
