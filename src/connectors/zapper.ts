import axios from "axios";
import { CurrencyExchange } from "../currencyExchange";
import { Balance, BaseConnector } from "./base_connector";
import { Buffer } from "buffer";

interface PortfolioV2Response {
  data: {
    portfolioV2: {
      tokenBalances: {
        totalBalanceUSD: number;
      };
      appBalances: {
        totalBalanceUSD: number;
      };
      nftBalances?: {
        totalBalanceUSD: number;
      };
    };
  };
}

export class ZapperConnector implements BaseConnector {
  settings: Record<string, any>;
  currencyExchange: CurrencyExchange;
  private headers: Record<string, string>;
  private graphqlEndpoint = "https://public.zapper.xyz/graphql";

  constructor(
    apiKey: string,
    settings: Record<string, any>,
    currencyExchange: CurrencyExchange
  ) {
    this.settings = settings;
    this.currencyExchange = currencyExchange;
    this.headers = {
      Authorization: `Basic ${Buffer.from(apiKey + ":").toString("base64")}`,
      "Content-Type": "application/json",
    };
  }

  balanceTTLSeconds(): number {
    return 60 * 60 * 2;
  }

  cacheKey(): string {
    return this.settings.address;
  }

  private getPortfolioQuery() {
    return `
      query PortfolioV2($addresses: [Address!]!) {
        portfolioV2(addresses: $addresses) {
          tokenBalances {
            totalBalanceUSD
          }
          appBalances {
            totalBalanceUSD
          }
          nftBalances {
            totalBalanceUSD
          }
        }
      }
    `;
  }

  async getPortfolioBalance() {
    try {
      const response = await axios.post<PortfolioV2Response>(
        this.graphqlEndpoint,
        {
          query: this.getPortfolioQuery(),
          variables: {
            addresses: [this.settings.address],
          },
        },
        {
          headers: this.headers,
        }
      );

      if (!response.data.data?.portfolioV2) {
        throw new Error("Invalid response from Zapper API");
      }

      const portfolio = response.data.data.portfolioV2;
      
      // Calculate total balance (tokens + apps + NFTs)
      const totalBalanceUSD = 
        (portfolio.tokenBalances?.totalBalanceUSD || 0) +
        (portfolio.appBalances?.totalBalanceUSD || 0) +
        (portfolio.nftBalances?.totalBalanceUSD || 0);

      return {
        balance: totalBalanceUSD,
      };
    } catch (error: any) {
      console.error("Error fetching portfolio from Zapper:", error);
      
      // Log more detailed error information
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", JSON.stringify(error.response.data));
      }
      
      throw new Error(`Failed to fetch portfolio from Zapper: ${error.message}`);
    }
  }

  async getBalance(): Promise<Balance> {
    try {
      const portfolioBalance = await this.getPortfolioBalance();

      // Convert USD balance to target currency
      const value = await this.currencyExchange.convert(
        portfolioBalance.balance,
        "USD",
        this.settings.currency
      );

      return {
        value,
        outdated: false,
        ttl: this.balanceTTLSeconds(),
      };
    } catch (error) {
      console.error("Error fetching balance from Zapper:", error);
      throw new Error("Failed to fetch balance from Zapper");
    }
  }
}
