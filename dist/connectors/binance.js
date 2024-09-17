"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceConnector = void 0;
const { Spot } = require("@binance/connector");
const https_1 = __importDefault(require("https"));
class BinanceConnector {
    constructor(settings) {
        this.settings = settings;
        const httpsAgent = new https_1.default.Agent({
            rejectUnauthorized: false,
        });
        this.client = new Spot(settings.api_key, settings.api_secret, {
            httpsAgent: httpsAgent,
        });
    }
    async getBalance() {
        return await this.convertBTC(await this.getBTCBalance());
    }
    async getBTCBalance(type = "SPOT") {
        try {
            const response = await this.client.accountSnapshot(type);
            if (response.data.snapshotVos.length === 0) {
                throw new Error("No snapshots found");
            }
            const btcBalance = response.data.snapshotVos.at(-1).data.totalAssetOfBtc;
            return parseFloat(btcBalance);
        }
        catch (error) {
            console.error("Error fetching account snapshot:", error);
            throw new Error("Failed to fetch account snapshot from Binance");
        }
    }
    async convertBTC(btcAmount) {
        const currency = this.settings.currency;
        const ticker = currency === "USD" ? "BTCUSDT" : "BTCEUR";
        try {
            const response = await this.client.tickerPrice(ticker);
            const btcPrice = parseFloat(response.data.price);
            return btcAmount * btcPrice;
        }
        catch (error) {
            console.error(`Error fetching ${ticker} price:`, error);
            throw new Error("Failed to convert BTC");
        }
    }
}
exports.BinanceConnector = BinanceConnector;
