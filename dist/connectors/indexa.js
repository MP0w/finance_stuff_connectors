"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexaConnector = void 0;
class IndexaConnector {
    constructor(settings, currencyExchange) {
        this.settings = settings;
        this.currencyExchange = currencyExchange;
    }
    async getBalance() {
        throw new Error("Method not implemented.");
    }
}
exports.IndexaConnector = IndexaConnector;
