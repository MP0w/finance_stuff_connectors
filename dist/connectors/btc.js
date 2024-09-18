"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BTCConnector = void 0;
let cachedBTCPrice = undefined;
let cachedBTCPriceTimestamp = undefined;
class BTCConnector {
    constructor(settings, currencyExchange) {
        this.settings = settings;
        this.currencyExchange = currencyExchange;
    }
    async getBTCPrice() {
        if (cachedBTCPrice &&
            cachedBTCPriceTimestamp &&
            Date.now() - cachedBTCPriceTimestamp < 1000 * 60 * 30) {
            return cachedBTCPrice;
        }
        const priceResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
        const priceData = await priceResponse.json();
        const btcPriceUSD = priceData.bitcoin.usd;
        cachedBTCPrice = btcPriceUSD;
        cachedBTCPriceTimestamp = Date.now();
        return btcPriceUSD;
    }
    async getBalance() {
        var _a;
        const addresses = ((_a = this.settings.addresses) !== null && _a !== void 0 ? _a : "")
            .replace(" ", "")
            .split(",")
            .filter((a) => a.length > 0)
            .join("|");
        const balanceResponse = await fetch(`https://blockchain.info/balance?active=${addresses}`);
        const balanceData = await balanceResponse.json();
        console.log(balanceData);
        let balanceSum = 0;
        Object.values(balanceData).forEach((addressData) => {
            balanceSum += addressData.final_balance;
        });
        const btcBalance = balanceSum / 100000000;
        const btcPriceUSD = await this.getBTCPrice();
        const usdBalance = btcBalance * btcPriceUSD;
        return {
            value: await this.currencyExchange.convert(usdBalance, "USD", this.settings.currency),
        };
    }
}
exports.BTCConnector = BTCConnector;
