import { BaseConnector } from "./base_connector";
const { Spot } = require("@binance/connector");
import https from "https";

export class BinanceConnector implements BaseConnector {
  private client;
  settings: Record<string, any>;

  constructor(settings: Record<string, any>) {
    this.settings = settings;

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    this.client = new Spot(settings.api_key, settings.api_secret, {
      httpsAgent: httpsAgent,
    });
  }

  async getBalance(): Promise<number> {
    return await this.convertBTC(await this.getBTCBalance());
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
    const ticker = currency === "USD" ? "BTCUSDT" : "BTCEUR";
    try {
      const response = await this.client.tickerPrice(ticker);
      const btcPrice = parseFloat(response.data.price);
      return btcAmount * btcPrice;
    } catch (error) {
      console.error(`Error fetching ${ticker} price:`, error);
      throw new Error("Failed to convert BTC");
    }
  }
}
