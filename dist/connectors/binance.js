"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceConnector = void 0;
class BinanceConnector {
    constructor(settings) {
        this.settings = settings;
    }
    async getBalance() {
        // just for testing
        if (this.settings.api_key === "42") {
            return 42;
        }
        throw new Error("Method not implemented.");
    }
}
exports.BinanceConnector = BinanceConnector;
