"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexaConnector = void 0;
const axios_1 = __importDefault(require("axios"));
class IndexaConnector {
    constructor(settings, currencyExchange) {
        this.settings = settings;
        this.currencyExchange = currencyExchange;
    }
    async getBalance() {
        var _a;
        try {
            const accounts = ((_a = this.settings.accounts) !== null && _a !== void 0 ? _a : "")
                .replace(" ", "")
                .split(",")
                .filter((a) => a.length > 0);
            const apiUrl = "https://api.indexacapital.com";
            const headers = { "X-AUTH-TOKEN": this.settings.token };
            if (!accounts.length) {
                const accountResponse = await (0, axios_1.default)(`${apiUrl}/users/me`, {
                    headers,
                });
                const activeAccounts = accountResponse.data.accounts
                    .filter((account) => account.status === "active")
                    .map((account) => account.account_number);
                accounts.push(...activeAccounts);
            }
            let value = 0;
            let cost = 0;
            for (const account of accounts) {
                const response = await axios_1.default.get(`${apiUrl}/accounts/${account}/portfolio`, {
                    headers,
                });
                value += response.data.portfolio.total_amount;
                cost +=
                    response.data.portfolio.instruments_cost +
                        response.data.portfolio.cash_amount;
            }
            return {
                value: await this.currencyExchange.convert(value, "EUR", this.settings.currency),
                cost: await this.currencyExchange.convert(cost, "EUR", this.settings.currency),
            };
        }
        catch (error) {
            console.error("Error fetching balance from Indexa:", error);
            throw new Error("Failed to fetch balance from Indexa");
        }
    }
}
exports.IndexaConnector = IndexaConnector;
