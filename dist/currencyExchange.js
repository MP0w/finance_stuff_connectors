"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyExchange = void 0;
class CurrencyExchange {
    constructor(currencyAPIKey) {
        this.currencyAPIKey = currencyAPIKey;
    }
    async getExchangeEURUSDRate() {
        if (this.cachedExchangeEURUSDRate &&
            this.cachedExchangeEURUSDRateTimestamp &&
            Date.now() - this.cachedExchangeEURUSDRateTimestamp < 1000 * 60 * 60 * 24) {
            return this.cachedExchangeEURUSDRate;
        }
        const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${this.currencyAPIKey}&currencies=USD,EUR`);
        const data = await response.json();
        const exchangeRate = data.data.USD.value / data.data.EUR.value;
        this.cachedExchangeEURUSDRate = exchangeRate;
        this.cachedExchangeEURUSDRateTimestamp = Date.now();
        return exchangeRate;
    }
    async convertEurToUsd(amount) {
        return amount * (await this.getExchangeEURUSDRate());
    }
    async convertUsdToEur(amount) {
        return amount / (await this.getExchangeEURUSDRate());
    }
    convert(amount, from, to) {
        if (from === "EUR" && to === "USD") {
            return this.convertEurToUsd(amount);
        }
        if (from === "USD" && to === "EUR") {
            return this.convertUsdToEur(amount);
        }
        return Promise.resolve(amount);
    }
}
exports.CurrencyExchange = CurrencyExchange;
