export interface CurrencyExchanger {
  convert(
    amount: number,
    from: "EUR" | "USD",
    to: "EUR" | "USD"
  ): Promise<number>;
}

export class CurrencyExchange implements CurrencyExchanger {
  currencyAPIKey: string;
  cachedExchangeEURUSDRate: number | undefined;
  cachedExchangeEURUSDRateTimestamp: number | undefined;

  constructor(currencyAPIKey: string) {
    this.currencyAPIKey = currencyAPIKey;
  }

  async getExchangeEURUSDRate(): Promise<number> {
    if (
      this.cachedExchangeEURUSDRate &&
      this.cachedExchangeEURUSDRateTimestamp &&
      Date.now() - this.cachedExchangeEURUSDRateTimestamp < 1000 * 60 * 60 * 24
    ) {
      return this.cachedExchangeEURUSDRate;
    }

    const response = await fetch(
      `https://api.currencyapi.com/v3/latest?apikey=${this.currencyAPIKey}&currencies=USD,EUR`
    );
    const data = await response.json();
    const exchangeRate = data.data.USD.value / data.data.EUR.value;
    this.cachedExchangeEURUSDRate = exchangeRate;
    this.cachedExchangeEURUSDRateTimestamp = Date.now();

    return exchangeRate;
  }

  async convertEurToUsd(amount: number) {
    return amount * (await this.getExchangeEURUSDRate());
  }
  async convertUsdToEur(amount: number) {
    return amount / (await this.getExchangeEURUSDRate());
  }

  convert(
    amount: number,
    from: "EUR" | "USD",
    to: "EUR" | "USD"
  ): Promise<number> {
    if (from === "EUR" && to === "USD") {
      return this.convertEurToUsd(amount);
    }
    if (from === "USD" && to === "EUR") {
      return this.convertUsdToEur(amount);
    }

    return Promise.resolve(amount);
  }
}
