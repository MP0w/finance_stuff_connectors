import { CurrencyExchange } from "../currencyExchange";
import { BaseConnector } from "./base_connector";

let cachedBTCPrice: number | undefined = undefined;
let cachedBTCPriceTimestamp: number | undefined = undefined;

export class BTCConnector implements BaseConnector {
  private settings: Record<string, any>;
  private currencyExchange: CurrencyExchange;

  constructor(
    settings: Record<string, any>,
    currencyExchange: CurrencyExchange
  ) {
    this.settings = settings;
    this.currencyExchange = currencyExchange;
  }

  balanceTTLSeconds(): number {
    return 30 * 60;
  }

  cacheKey(): string {
    return this.settings.addresses;
  }

  async getBTCPrice(): Promise<number> {
    if (
      cachedBTCPrice &&
      cachedBTCPriceTimestamp &&
      Date.now() - cachedBTCPriceTimestamp < 1000 * 60 * 30
    ) {
      return cachedBTCPrice;
    }

    const priceResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );

    const priceData = await priceResponse.json();
    const btcPriceUSD: number = priceData.bitcoin.usd;

    cachedBTCPrice = btcPriceUSD;
    cachedBTCPriceTimestamp = Date.now();

    return btcPriceUSD;
  }

  async getBalance(): Promise<{ value: number; cost?: number }> {
    const addresses = ((this.settings.addresses as string) ?? "")
      .replace(" ", "")
      .split(",")
      .filter((a) => a.length > 0)
      .join("|");

    const balanceResponse = await fetch(
      `https://blockchain.info/balance?active=${addresses}`
    );
    const balanceData: Record<string, { final_balance: number }> =
      await balanceResponse.json();

    let balanceSum = 0;
    Object.values(balanceData).forEach((addressData) => {
      balanceSum += addressData.final_balance;
    });

    const btcBalance = balanceSum / 100000000;
    const btcPriceUSD = await this.getBTCPrice();

    const usdBalance = btcBalance * btcPriceUSD;
    return {
      value: await this.currencyExchange.convert(
        usdBalance,
        "USD",
        this.settings.currency
      ),
    };
  }
}
