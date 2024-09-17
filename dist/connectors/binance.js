"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceConnector = void 0;
class BinanceConnector {
    constructor(settings) {
        this.settings = settings;
    }
    async getBalance() {
        throw new Error("Method not implemented.");
    }
}
exports.BinanceConnector = BinanceConnector;
