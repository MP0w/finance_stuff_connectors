"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebankConnector = void 0;
const axios_1 = __importDefault(require("axios"));
class DebankConnector {
    constructor(apiKey, settings, currencyExchange) {
        this.settings = settings;
        this.currencyExchange = currencyExchange;
        this.apiKey = apiKey;
    }
    async getBalance() {
        try {
            const apiUrl = "https://pro-openapi.debank.com/v1/user/total_balance";
            const response = await axios_1.default.get(apiUrl, {
                params: { id: this.settings.address },
                headers: { AccessKey: this.apiKey },
            });
            return this.currencyExchange.convert(response.data.total_usd_value, "USD", this.settings.currency);
        }
        catch (error) {
            console.error("Error fetching balance from Debank:", error);
            throw new Error("Failed to fetch balance from Debank");
        }
    }
}
exports.DebankConnector = DebankConnector;
