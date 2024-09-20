import axios from "axios";
import { CurrencyExchange } from "../currencyExchange";
import { BaseConnector } from "./base_connector";

type IndexaPortfolio = {
  portfolio: {
    total_amount: number;
    instruments_cost: number;
    cash_amount: number;
  };
};

export class IndexaConnector implements BaseConnector {
  private currencyExchange: CurrencyExchange;
  private settings: Record<string, any>;

  constructor(
    settings: Record<string, any>,
    currencyExchange: CurrencyExchange
  ) {
    this.settings = settings;
    this.currencyExchange = currencyExchange;
  }

  balanceTTLSeconds(): number {
    return 240 * 60;
  }

  cacheKey(): string {
    return this.settings.token + this.settings.accounts;
  }

  async getBalance(): Promise<{ value: number; cost?: number }> {
    try {
      const accounts: string[] = ((this.settings.accounts as string) ?? "")
        .replace(" ", "")
        .split(",")
        .filter((a) => a.length > 0);

      const apiUrl = "https://api.indexacapital.com";
      const headers = { "X-AUTH-TOKEN": this.settings.token };

      if (!accounts.length) {
        const accountResponse = await axios<{
          accounts: { account_number: string; status: string }[];
        }>(`${apiUrl}/users/me`, {
          headers,
        });

        const activeAccounts = accountResponse.data.accounts
          .filter((account) => account.status === "active")
          .map((account) => account.account_number);
        accounts.push(...activeAccounts);
      }

      let value = 0;
      let cost = 0;

      for (const account of accounts) {
        const response = await axios.get<IndexaPortfolio>(
          `${apiUrl}/accounts/${account}/portfolio`,
          {
            headers,
          }
        );

        value += response.data.portfolio.total_amount;
        cost +=
          response.data.portfolio.instruments_cost +
          response.data.portfolio.cash_amount;
      }

      return {
        value: await this.currencyExchange.convert(
          value,
          "EUR",
          this.settings.currency
        ),
        cost: await this.currencyExchange.convert(
          cost,
          "EUR",
          this.settings.currency
        ),
      };
    } catch (error) {
      console.error("Error fetching balance from Indexa:", error);
      throw new Error("Failed to fetch balance from Indexa");
    }
  }
}
