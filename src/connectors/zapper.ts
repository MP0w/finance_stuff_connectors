import axios from "axios";
import { CurrencyExchange } from "../currencyExchange";
import { Balance, BaseConnector } from "./base_connector";
import { Buffer } from "buffer"; // Added import for Buffer

export class ZapperConnector implements BaseConnector {
  settings: Record<string, any>;
  currencyExchange: CurrencyExchange;
  private headers: Record<string, string>;

  constructor(
    apiKey: string,
    settings: Record<string, any>,
    currencyExchange: CurrencyExchange
  ) {
    this.settings = settings;
    this.currencyExchange = currencyExchange;
    this.headers = {
      Authorization: `Basic ${Buffer.from(apiKey + ":").toString("base64")}`,
    };
  }

  balanceTTLSeconds(): number {
    return 60 * 60 * 4;
  }

  cacheKey(): string {
    return this.settings.address;
  }

  private tokensEndpoint = () =>
    "https://api.zapper.xyz/v2/balances/tokens?addresses[]=" +
    this.settings.address;
  private appsEndpoint = () =>
    "https://api.zapper.xyz/v2/balances/apps?addresses[]=" +
    this.settings.address;

  async getTokensBalance() {
    const response = await axios.get<{
      [key: string]: { token: { balanceUSD: number }; updatedAt: string }[];
    }>(this.tokensEndpoint(), {
      headers: this.headers,
    });

    const addressData = response.data[this.settings.address];

    const defaultResult = { balance: 0, updatedAt: new Date() };
    const result =
      addressData?.reduce((acc, address) => {
        acc.balance += address.token.balanceUSD;
        acc.updatedAt =
          acc.updatedAt.getTime() < new Date(address.updatedAt).getTime()
            ? acc.updatedAt
            : new Date(address.updatedAt);
        return acc;
      }, defaultResult) ?? defaultResult;

    const elapsed = (Date.now() - result.updatedAt.getTime()) / 1000;

    return {
      value: await this.currencyExchange.convert(
        result.balance,
        "USD",
        this.settings.currency
      ),
      shouldRefresh: elapsed > this.balanceTTLSeconds(),
      elapsed,
      isEmpty: addressData?.length ?? 0 === 0,
    };
  }

  async getAppsBalance() {
    const response = await axios.get<
      { updatedAt: string; balanceUSD: number }[]
    >(this.appsEndpoint(), {
      headers: this.headers,
    });

    const result = response.data.reduce(
      (acc, address) => {
        acc.balance += address.balanceUSD;
        acc.updatedAt =
          acc.updatedAt.getTime() < new Date(address.updatedAt).getTime()
            ? acc.updatedAt
            : new Date(address.updatedAt);
        return acc;
      },
      { balance: 0, updatedAt: new Date() }
    );

    const elapsed = (Date.now() - result.updatedAt.getTime()) / 1000;

    return {
      value: await this.currencyExchange.convert(
        result.balance,
        "USD",
        this.settings.currency
      ),
      shouldRefresh: elapsed > this.balanceTTLSeconds(),
      elapsed,
      isEmpty: response.data.length === 0,
    };
  }

  async refreshJob(url: string) {
    const response = await axios.post(url, null, {
      headers: this.headers,
    });

    console.log("Zapper Refresh job", JSON.stringify(response.data));
  }

  //   async getJobStatus(id: string) {
  //     const response = await axios.get(
  //       "https://api.zapper.xyz/v2/balances/job-status?jobId=" + id,
  //       {
  //         headers: this.headers,
  //       }
  //     );
  //     console.log("Zapper Refresh job status", JSON.stringify(response.data));
  //   }

  async getBalance(): Promise<Balance> {
    try {
      const tokensBalance = await this.getTokensBalance();
      const appsBalance = await this.getAppsBalance();

      const shouldRefresh =
        tokensBalance.shouldRefresh || appsBalance.shouldRefresh;

      if (tokensBalance.shouldRefresh || tokensBalance.isEmpty) {
        await this.refreshJob(this.tokensEndpoint());
      }

      if (appsBalance.shouldRefresh || appsBalance.isEmpty) {
        await this.refreshJob(this.appsEndpoint());
      }

      const maxElapsed = Math.max(tokensBalance.elapsed, appsBalance.elapsed);
      console.log("Max elapsed", maxElapsed);
      var ttl = shouldRefresh ? 20 : this.balanceTTLSeconds() - maxElapsed;
      if (shouldRefresh) {
        // not if empty to prevent loops
        ttl = 20;
      }

      return {
        value: tokensBalance.value + appsBalance.value,
        outdated: tokensBalance.shouldRefresh || appsBalance.shouldRefresh,
        ttl,
      };
    } catch (error) {
      console.error("Error fetching balance from Zapper:", error);
      throw new Error("Failed to fetch balance from Zapper");
    }
  }
}
