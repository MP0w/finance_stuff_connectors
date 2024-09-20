import { CurrencyExchange } from "../currencyExchange";
import { BaseConnector } from "./base_connector";
const { Spot } = require("@binance/connector");
import https from "https";

export class BinanceConnector implements BaseConnector {
  private client;
  private settings: Record<string, any>;
  private currencyExchange: CurrencyExchange;

  constructor(
    settings: Record<string, any>,
    currencyExchange: CurrencyExchange
  ) {
    this.settings = settings;
    this.currencyExchange = currencyExchange;

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    this.client = new Spot(settings.api_key, settings.api_secret, {
      httpsAgent: httpsAgent,
    });
  }

  cacheKey(): string {
    return this.settings.api_key + this.settings.api_secret;
  }

  balanceTTLSeconds(): number {
    return 30 * 60;
  }

  async getBalance(): Promise<{ value: number; cost?: number }> {
    return { value: await this.convertBTC(await this.getBTCBalance()) };
  }

  async getBTCBalance(type: string = "SPOT"): Promise<number> {
    try {
      const response = await this.client.accountSnapshot(type);
      if (response.data.snapshotVos.length === 0) {
        throw new Error("No snapshots found");
      }

      const btcBalance = response.data.snapshotVos.at(-1).data.totalAssetOfBtc;

      return parseFloat(btcBalance);
    } catch (error) {
      console.error("Error fetching account snapshot:", error);
      throw new Error("Failed to fetch account snapshot from Binance");
    }
  }

  async convertBTC(btcAmount: number): Promise<number> {
    const currency = this.settings.currency;
    try {
      const response = await this.client.tickerPrice("BTCUSDT");
      const btcPrice = parseFloat(response.data.price);
      return this.currencyExchange.convert(
        btcAmount * btcPrice,
        "USD",
        currency
      );
    } catch (error) {
      console.error(`Error fetching BTC price:`, error);
      throw new Error("Failed to convert BTC");
    }
  }
}
